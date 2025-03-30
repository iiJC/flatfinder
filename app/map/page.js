"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg";

    const initializedMap = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [170.5028, -45.8788],
      zoom: 12,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    setMap(initializedMap);

    initializedMap.on("load", () => {
      initializedMap.addLayer({
        id: "terrain",
        type: "raster-dem",
        source: {
          type: "raster",
          url: "mapbox://mapbox.terrain-rgb",
          tileSize: 512,
        },
        minzoom: 0,
        maxzoom: 13,
      });

      initializedMap.addLayer({
        id: "3d-buildings",
        type: "fill-extrusion",
        source: {
          type: "vector",
          url: "mapbox://mapbox.buildings",
        },
        "source-layer": "building",
        paint: {
          "fill-extrusion-color": "#aaa",
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
        },
      });
    });

    const marker = new mapboxgl.Marker({
      color: "#314ccd",
    });

    marker.setLngLat([170.5028, -45.8788]).addTo(initializedMap);

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });

    initializedMap.addControl(geolocate);
    geolocate.trigger();

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: {
        color: "#314ccd",
      },
      placeholder: "Search for a place...",
      proximity: { longitude: 170.5028, latitude: -45.8788 },
    });

    initializedMap.addControl(geocoder);

    return () => initializedMap.remove();
  }, []);

  const changeMapStyle = (style) => {
    if (map) {
      map.setStyle(style);
    }
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  <div>
    <h2 className="text-2xl font-semibold">Map View</h2>
    <div className="hamburger-menu" onClick={toggleMenu}>
      ☰
    </div>
    {menuVisible && (
      <div className="menu">
        <button onClick={() => changeMapStyle("mapbox://styles/mapbox/satellite-v9")}>Satellite View</button>
        <button onClick={() => changeMapStyle("mapbox://styles/mapbox/streets-v11")}>Street View</button>
        <button onClick={() => changeMapStyle("mapbox://styles/mapbox/outdoors-v11")}>Outdoor View</button>
      </div>
    )}
    <div id="map" ref={mapContainerRef} style={{ height: "700px", width: "100%" }} />
  </div>;
}
