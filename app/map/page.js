"use client";

import "../css/map.scss";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { POIS } from "@/lib/pois";

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || typeof window === "undefined" || !mapContainerRef.current)
      return;

    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg";

    const initializedMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [170.5028, -45.8788],
      zoom: 12,
      pitch: 0,
      bearing: 0,
      antialias: true
    });

    setMap(initializedMap);

    initializedMap.on("load", async () => {
      // Fetch flats from API
      const res = await fetch("/api/getFlats");
      const flats = await res.json();

      flats.forEach((flat) => {
        if (flat.coordinates?.coordinates?.length === 2) {
          const [lng, lat] = flat.coordinates.coordinates;

          const popupHtml = `
            <h3>${flat.name}</h3>
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
            .addTo(initializedMap);
        }
      });

      // Geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
        showUserLocation: true
      });

      initializedMap.addControl(geolocate);
      geolocate.trigger();

      // Adding POIs
      Object.values(POIS)
        .flat()
        .forEach((poi) => {
          new mapboxgl.Marker({ color: "#f97316" }) // orange for POIs
            .setLngLat(poi.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
            .addTo(initializedMap);
        });

      // Search bar
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        marker: { color: "#314ccd" },
        placeholder: "Search for a place...",
        proximity: { longitude: 170.5028, latitude: -45.8788 }
      });

      initializedMap.addControl(geocoder);
    });

    return () => initializedMap.remove();
  }, [isClient]);

  const changeMapStyle = (style) => {
    if (map) {
      map.setStyle(style);
    }
  };

  return (
    <div className="map-container">
      <h2 className="title">Map View</h2>
      <button
        className="menu-button"
        onClick={() => setMenuVisible(!menuVisible)}
      >
        ☰ Menu
      </button>
      {menuVisible && (
        <div className="menu">
          <button
            onClick={() =>
              changeMapStyle("mapbox://styles/mapbox/satellite-v9")
            }
          >
            Satellite View
          </button>
          <button
            onClick={() => changeMapStyle("mapbox://styles/mapbox/streets-v11")}
          >
            Street View
          </button>
          <button
            onClick={() =>
              changeMapStyle("mapbox://styles/mapbox/outdoors-v11")
            }
          >
            Outdoor View
          </button>
        </div>
      )}
      <div ref={mapContainerRef} className="map" />
    </div>
  );
}
