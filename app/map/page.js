"use client";

import '../css/map.scss';
import "../css/globals.scss"; 
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);
  }, []);


  useEffect(() => {

    if (!isClient || !mapContainerRef.current) return;

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
    const popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML('<h3>Address Flat Name</h3><img src="https://media.istockphoto.com/id/1402134774/photo/professional-road-cyclist-on-a-training-ride.jpg?s=612x612&w=0&k=20&c=CB2o_DXMgH15MLa1CEqWwZVtVb3rpRgejV3UFnUwF_U=" alt="Ga" width="150" height="100"><p>Rent PW:</p><p>Rooms Avaliable:</p><p>Rooms Avaliable:</p>');
    marker.setPopup(popup);


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
  return (
    <div className="map-container">
       <h2 className="map-title">Map View</h2>
 
       <button className="menu-button" onClick={() => setMenuVisible(!menuVisible)}>
         ☰ Menu
       </button>
      {menuVisible && (
        <div className="menu">
          <button onClick={() => changeMapStyle("mapbox://styles/mapbox/satellite-v9")}>Satellite View</button>
          <button onClick={() => changeMapStyle("mapbox://styles/mapbox/streets-v11")}>Street View</button>
          <button onClick={() => changeMapStyle("mapbox://styles/mapbox/outdoors-v11")}>Outdoor View</button>
        </div>
      )}
      <div ref={mapContainerRef} className="map" />
    </div>
  );
}
