'use client';

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapPage() {
  const mapContainerRef = useRef(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg';

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [170.5028, -45.8788],
      zoom: 12,
      pitch: 45,
      bearing: 0,
      antialias: true,
    });

    map.on('load', () => {
      map.addLayer({
        id: 'terrain',
        type: 'raster-dem',
        source: {
          type: 'raster',
          url: 'mapbox://mapbox.terrain-rgb',
          tileSize: 512,
        },
        minzoom: 0,
        maxzoom: 13,
      });

      map.addLayer({
        id: '3d-buildings',
        type: 'fill-extrusion',
        source: {
          type: 'vector',
          url: 'mapbox://mapbox.buildings',
        },
        'source-layer': 'building',
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
        },
      });
    });

    const marker = new mapboxgl.Marker({
      color: '#314ccd',
    });

    marker.setLngLat([170.5028, -45.8788]).addTo(map);

    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserLocation: true,
    });

    map.addControl(geolocate);
    geolocate.trigger();

    return () => map.remove();
  }, []);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold">Map View</h2>
      <div className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </div>
      {menuVisible && (
        <div className="menu">
          <button onClick={() => alert('Switch to Satellite View')}>Satellite View</button>
          <button onClick={() => alert('Switch to Street View')}>Street View</button>
          <button onClick={() => alert('Switch to Default View')}>Default View</button>
        </div>
      )}
      <div id="map" ref={mapContainerRef} style={{ height: '700px', width: '100%' }} />
    </div>
  );
}
