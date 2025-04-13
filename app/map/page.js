"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import { POIS } from "@/lib/pois";

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [flats, setFlats] = useState([]);
  const [visiblePOIs, setVisiblePOIs] = useState({
    gyms: true,
    supermarkets: true,
    university: true
  });
  const [tagFilters, setTagFilters] = useState([]);
  const [minRent, setMinRent] = useState(0);
  const [maxRent, setMaxRent] = useState(2000);
  const [minRooms, setMinRooms] = useState(0);

  const allTags = [
    "Warm",
    "Sunny",
    "Modern",
    "Quiet",
    "Party",
    "Social",
    "Close to Uni",
    "Furnished"
  ];

  const getPoiIcon = (category) => {
    switch (category) {
      case "gyms":
        return "🏋️";
      case "supermarkets":
        return "🛒";
      case "university":
        return "🎓";
      case "bus stops":
        return "#aaa";
      default:
        return "#aaa";
    }
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg";

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [170.5028, -45.8788],
      zoom: 13
    });

    setMap(map);

    map.on("load", async () => {
      const res = await fetch("/api/getFlats");
      const data = await res.json();
      setFlats(data);

      data.forEach((flat) => {
        if (
          flat.coordinates?.coordinates?.length === 2 &&
          flat.rent_per_week >= minRent &&
          flat.rent_per_week <= maxRent &&
          parseInt(flat.rooms) >= minRooms &&
          (tagFilters.length === 0 ||
            tagFilters.every((tag) => flat.tags?.includes(tag)))
        ) {
          const [lng, lat] = flat.coordinates.coordinates;

          const popupHtml = `
            <h3>${flat.flat_name || "Unnamed Flat"}</h3>
            <p><strong>Address:</strong> ${flat.address}</p>
            <p><strong>Rent:</strong> $${flat.rent_per_week} / week</p>
            <p><strong>Bond:</strong> $${flat.bond}</p>
            <p><strong>Rooms:</strong> ${flat.rooms}</p>
            <p><strong>Available Rooms:</strong> ${flat.available_rooms}</p>
            <p><strong>Distance from Uni:</strong> ${flat.distance_from_uni}</p>
            <p>${flat.description || ""}</p>
          `;

          new mapboxgl.Marker({ color: "#314ccd" })
            .setLngLat([lng, lat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupHtml))
            .addTo(map);
        }
      });

      Object.entries(POIS).forEach(([category, pois]) => {
        if (visiblePOIs[category]) {
          pois.forEach((poi) => {
            const el = document.createElement("div");
            el.className = "custom-marker";
            el.textContent = getPoiIcon(category);
            el.style.fontSize = "24px";
            el.style.lineHeight = "1";
            el.style.cursor = "pointer";

            new mapboxgl.Marker(el)
              .setLngLat(poi.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
              .addTo(map);
          });
        }
      });
    });

    return () => map.remove();
  }, [visiblePOIs, tagFilters, minRent, maxRent, minRooms]);

  return (
    <div className="map-page" style={{ display: "flex" }}>
      <div style={{ minWidth: "240px", padding: "1rem" }}>
        <h2>Filter Flats</h2>
        <div>
          <label>Tags:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
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
                  backgroundColor: tagFilters.includes(tag)
                    ? "#4caf50"
                    : "#ccc",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>
            Rent: ${minRent} - ${maxRent}
          </label>
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
          <label>Minimum Rooms: {minRooms}</label>
          <input
            type="number"
            min="0"
            value={minRooms}
            onChange={(e) => setMinRooms(Number(e.target.value))}
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
                    [category]: e.target.checked
                  }))
                }
              />
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </label>
          ))}
        </div>
      </div>
      <div
        ref={mapContainerRef}
        style={{ height: "90vh", flex: 1, borderRadius: "8px" }}
      />
    </div>
  );
}
