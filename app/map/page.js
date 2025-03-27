'use client';

import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapPage() {
  const mapContainerRef = useRef(null);
  
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg';
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [170.5028, -45.8788],
      zoom: 9
    });
    
    return () => map.remove();
  }, []);
  
  return (
    <div>
      <h2 className="text-2xl font-semibold">Map View</h2>
      <div id="map" ref={mapContainerRef} style={{ height: '700px', width: '100%' }} />
    </div>
  );
}
