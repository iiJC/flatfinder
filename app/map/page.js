"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import * as turf from "@turf/turf";
import "mapbox-gl/dist/mapbox-gl.css";
import { POIS } from "@/lib/pois";
import "../css/popUp.scss";
import "../css/globals.scss";
import "../css/map.scss";

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const geocoderRef = useRef(null);
  const geocoderControlRef = useRef(null);
  const userMarkerRef = useRef(null);

  const [map, setMap] = useState(null);
  const [flats, setFlats] = useState([]);
  const [visiblePOIs, setVisiblePOIs] = useState({
    gyms: true,
    supermarkets: true,
    university: true,
  });
  const [tagFilters, setTagFilters] = useState([]);
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(2000);
  const [minRooms, setMinRooms] = useState(0);
  const [maxDistanceFromUni, setMaxDistanceFromUni] = useState(5000);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapStyle, setMapStyle] = useState(
    "mapbox://styles/mapbox/satellite-v9"
  );

  const [searchAddress, setSearchAddress] = useState("");
  const [searchDistance, setSearchDistance] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [searchMarker, setSearchMarker] = useState(null);

  const allTags = [
    "Warm",
    "Sunny",
    "Modern",
    "Quiet",
    "Party",
    "Social",
    "Close to Uni",
    "Furnished",
  ];

  const getPoiIcon = (category) => {
    switch (category) {
      case "gyms":
        return "🏋️";
      case "supermarkets":
        return "🛒";
      case "university":
        return "🎓";
      default:
        return "#aaa";
    }
  };

  const createFlatPopup = (flat) => {
    const images = flat.images || [];
    const imageElements = images
      .map(
        (img, index) => `
        <img 
          src="data:${img.imageType};base64,${img.image}" 
          class="popup-image" 
          style="display: ${index === 0 ? "block" : "none"}; width: 100%; max-height: 180px; object-fit: cover; border-radius: 8px;" 
          data-index="${index}" 
        />
      `
      )
      .join("");

    const carouselControls =
      images.length > 1
        ? `
        <button class="carousel-btn prev" style="position: absolute; left: 0; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 6px 10px; cursor: pointer;">‹</button>
        <button class="carousel-btn next" style="position: absolute; right: 0; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 6px 10px; cursor: pointer;">›</button>
      `
        : "";

    return `
      <div class="flat-popup" style="font-size: 14px;">
        <h3>${flat.name || "Unnamed Flat"}</h3>
        <p><strong>Address:</strong> ${flat.address}</p>
        <p><strong>Rent:</strong> $${flat.rent_per_week} / week</p>
        <p><strong>Bond:</strong> $${flat.bond}</p>
        <p><strong>Available Rooms:</strong> ${flat.available_rooms}</p>
        <div class="image-carousel" style="position: relative; margin-top: 10px;">
          ${imageElements}
          ${carouselControls}
        </div>
        <a href="/flats/${flat._id}" class="flat-details-link" style="color: #314ccd; text-decoration: underline; display: inline-block; margin-top: 10px;">
          View Details
        </a>
      </div>
    `;
  };

  const addFlatsToMap = (map, flatsData) => {
    const newMarkers = [];

    const uniCoords = [170.5028, -45.8788];

    flatsData.forEach((flat) => {
      if (flat.coordinates?.coordinates?.length === 2) {
        const flatCoords = flat.coordinates.coordinates;
        const flatPoint = turf.point(flatCoords);
        const uniPoint = turf.point(uniCoords);
        // Distance in meters
        const distance = turf.distance(flatPoint, uniPoint, { units: "meters" });

        if (
          flat.rent_per_week >= minRent &&
          flat.rent_per_week <= maxRent &&
          parseInt(flat.rooms) >= minRooms &&
          (tagFilters.length === 0 ||
            tagFilters.every((tag) => flat.tags?.includes(tag))) &&
          distance <= maxDistanceFromUni
        ) {
          const [lng, lat] = flat.coordinates.coordinates;

          const el = document.createElement("div");
          el.className = "custom-marker";
          el.textContent = "🏠";
          el.style.cssText = `
          font-size: 24px;
          width: 48px;
          height: 48px;
          background: #79b6fc;
          color: #222;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        `;

          const popup = new mapboxgl.Popup({
            offset: 25,
            className: "custom-popup",
          }).setHTML(createFlatPopup(flat));

          const marker = new mapboxgl.Marker(el)
            .setLngLat([lng, lat])
            .setPopup(popup)
            .addTo(map);

          popup.on("open", () => {
            const popupEl = document.querySelector(".mapboxgl-popup .flat-popup");
            if (!popupEl) return;

            const images = popupEl.querySelectorAll(".popup-image");
            let currentIndex = 0;

            const updateCarousel = (index) => {
              images.forEach((img, i) => {
                img.style.display = i === index ? "block" : "none";
              });
            };

            const nextBtn = popupEl.querySelector(".carousel-btn.next");
            const prevBtn = popupEl.querySelector(".carousel-btn.prev");

            if (nextBtn) {
              nextBtn.addEventListener("click", () => {
                currentIndex = (currentIndex + 1) % images.length;
                updateCarousel(currentIndex);
              });
            }

            if (prevBtn) {
              prevBtn.addEventListener("click", () => {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateCarousel(currentIndex);
              });
            }
          });

          newMarkers.push(marker);
        }
      }
    });

    return newMarkers;
  };

  const addPOIsToMap = (map, pois) => {
    Object.entries(pois).forEach(([category, poiList]) => {
      if (visiblePOIs[category]) {
        poiList.forEach((poi) => {
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.textContent = getPoiIcon(category);
          el.style.fontSize = "20px";
          el.style.width = "36px";
          el.style.height = "36px";
          el.style.background = "#fff";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.borderRadius = "50%";
          el.style.cursor = "pointer";

          new mapboxgl.Marker(el)
            .setLngLat(poi.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
            .addTo(map);
        });
      }
    });
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY205Z2Z6Y2IxMWZmdjJscHFiZmJicWNoOCJ9.LxKNU1afAzTYLzx21hAYhQ";

    const newMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [170.5028, -45.8788],
      zoom: 13,
    });

    setMap(newMap);

    newMap.on("load", async () => {
      setLoading(true);

      const res = await fetch("/api/getFlats");
      const data = await res.json();
      setFlats(data);

      const newMarkers = addFlatsToMap(newMap, data);
      setMarkers(newMarkers);

      addPOIsToMap(newMap, POIS);

      setLoading(false);
    });

    return () => newMap.remove();
  }, []);

  useEffect(() => {
    if (map) {
      map.setStyle(mapStyle);
    }
  }, [mapStyle]);

  useEffect(() => {
    if (!map || !geocoderRef.current) return;

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      placeholder: "Search for a place in Dunedin",
      marker: false,
      proximity: { longitude: 170.5028, latitude: -45.8788 },
      bbox: [170.4, -45.95, 170.6, -45.8],
    });

    geocoderRef.current.innerHTML = "";
    geocoderRef.current.appendChild(geocoder.onAdd(map));

    geocoder.on("result", (e) => {
      const coords = e.result.geometry.coordinates;
      setSearchError("");
      setSearchDistance(null);

      if (searchMarker) {
        searchMarker.remove();
      }

      const newMarker = new mapboxgl.Marker({ color: "#FF5733" })
        .setLngLat(coords)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setText(
            `You searched: ${e.result.place_name}`
          )
        )
        .addTo(map);

      setSearchMarker(newMarker);
      map.flyTo({ center: coords, zoom: 14 });

      const searchedPoint = turf.point(coords);
      const distances = flats
        .map((flat) => {
          if (flat.coordinates?.coordinates?.length === 2) {
            const flatPoint = turf.point(flat.coordinates.coordinates);
            const distance = turf.distance(searchedPoint, flatPoint, {
              units: "kilometers",
            });
            return { ...flat, distance };
          }
          return null;
        })
        .filter(Boolean);

      if (distances.length > 0) {
        const closest = distances.reduce((a, b) =>
          a.distance < b.distance ? a : b
        );
        setSearchDistance(
          `Closest flat: ${closest.name || "Unnamed"} is ${closest.distance.toFixed(
            2
          )} km away`
        );
      } else {
        setSearchDistance("No flats found nearby.");
      }
    });

    return () => {
      if (geocoderRef.current) {
        geocoderRef.current.innerHTML = "";
      }
    };
  }, [map, searchMarker, flats]);

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.remove());

    const newMarkers = addFlatsToMap(map, flats);
    setMarkers(newMarkers);
  }, [
    map,
    flats,
    minRent,
    maxRent,
    minRooms,
    maxDistanceFromUni,
    tagFilters
  ]);

  return (
    <div className="map-page" style={{ display: "flex" }}>
      <div className="container" style={{ minWidth: "240px", padding: "1rem" }}>
        <h2>Filter Flats</h2>

        <div style={{ marginBottom: "1rem" }}>
          <label>
            <strong>Map Style:</strong>
          </label>
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            style={{
              marginTop: "0.25rem",
              padding: "0.25rem",
              width: "100%",
            }}
          >
            <option value="mapbox://styles/mapbox/streets-v12">Streets</option>
            <option value="mapbox://styles/mapbox/satellite-v9">Satellite</option>
            <option value="mapbox://styles/mapbox/dark-v11">Dark</option>
          </select>
        </div>

        <div>
          <label>Tags:</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.25rem",
            }}
          >
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  setTagFilters((prev) =>
                    prev.includes(tag)
                      ? prev.filter((t) => t !== tag)
                      : [...prev, tag]
                  )
                }
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: tagFilters.includes(tag) ? "#4caf50" : "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Rent: ${minRent} - ${maxRent}</label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={minRent}
            onChange={(e) => setMinRent(Number(e.target.value))}
          />
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            value={maxRent}
            onChange={(e) => setMaxRent(Number(e.target.value))}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Minimum Rooms:</label>
          <input
            type="number"
            min="0"
            value={minRooms}
            onChange={(e) => setMinRooms(Number(e.target.value))}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label>Max Distance to Uni (m): {maxDistanceFromUni}</label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxDistanceFromUni}
            onChange={(e) => setMaxDistanceFromUni(Number(e.target.value))}
          />
        </div>

        <div style={{ marginTop: "1rem" }}>
          <strong>Toggle POI Categories:</strong>
          {Object.keys(visiblePOIs).map((category) => (
            <label key={category} style={{ display: "block" }}>
              <input
                type="checkbox"
                checked={visiblePOIs[category]}
                onChange={(e) =>
                  setVisiblePOIs((prev) => ({
                    ...prev,
                    [category]: e.target.checked,
                  }))
                }
              />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>

        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#f8f9fc",
            border: "1px solid #dee2e6",
            borderRadius: "8px",
          }}
        >
          <h3
            style={{
              marginBottom: "0.5rem",
              color: "#314ccd",
            }}
          >
            Search for closest flat to location
          </h3>
          <div ref={geocoderRef} />

          {searchDistance && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#eaf4ff",
                border: "1px solid #b3d4fc",
                borderRadius: "6px",
                color: "#1e3a8a",
                fontWeight: 500,
                lineHeight: 1.4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              📍 {searchDistance}
            </div>
          )}

          {searchError && (
            <div
              style={{
                marginTop: "0.75rem",
                padding: "0.75rem 1rem",
                backgroundColor: "#ffeaea",
                border: "1px solid #f5a3a3",
                borderRadius: "6px",
                color: "#a30000",
                fontWeight: 500,
                lineHeight: 1.4,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              }}
            >
              ❌ {searchError}
            </div>
          )}
        </div>
      </div>

      <div style={{ position: "relative", flex: 1 }}>
        <div
          ref={mapContainerRef}
          data-testid="map"
          style={{ height: "90vh", borderRadius: "8px" }}
        />
        {loading && (
          <div className="map-loading-spinner">
            <div className="spinner" />
          </div>
        )}
      </div>
    </div>
  );
}
