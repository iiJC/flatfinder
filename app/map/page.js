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
      center: [-74.5, 40],
      zoom: 9
    });
    
    // Clean up on unmount
    return () => map.remove();
  }, []); // Empty dependency array means this effect runs once on mount
  
  return (
    <div>
      <h2 className="text-2xl font-semibold">Map View</h2>
      <div id="map" ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
