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

  const getPoiColor = (category) => {
    switch (category) {
      case "gyms":
        return "#1e90ff";
      case "supermarkets":
        return "#ff7f50";
      case "university":
        return "#32cd32";
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
        if (flat.coordinates?.coordinates?.length === 2) {
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

      // Add POIs
      Object.entries(POIS).forEach(([category, pois]) => {
        if (visiblePOIs[category]) {
          pois.forEach((poi) => {
            new mapboxgl.Marker({ color: getPoiColor(category) })
              .setLngLat(poi.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
              .addTo(map);
          });
        }
      });
    });

    return () => map.remove();
  }, [visiblePOIs]);

  return (
    <div className="map-page">
      <h1>Explore Flats</h1>
      <div>
        <strong>Toggle POI Categories:</strong>
        {Object.keys(visiblePOIs).map((category) => (
          <label key={category} style={{ marginLeft: "1rem" }}>
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
      <div
        ref={mapContainerRef}
        style={{ height: "80vh", borderRadius: "8px", marginTop: "1rem" }}
      />
    </div>
  );
}
