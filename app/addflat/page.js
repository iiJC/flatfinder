"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

const AddFlat = () => {
  const [formData, setFormData] = useState({
    flat_name: "",
    address: "",
    location: "",
    rent_per_week: "",
    bond: "",
    rooms: "",
    available_rooms: "",
    features: "",
    description: "",
    tags: "",
    distance_from_uni: "",
    utilities_included: "",
    images: "",
    coordinates: null
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const tagOptions = [
    "Warm",
    "Sunny",
    "Modern",
    "Quiet",
    "Party",
    "Social",
    "Close to Uni",
    "Furnished"
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg";

    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      placeholder: "Search for an address...",
      marker: false,
      countries: "nz",
      proximity: { longitude: 170.5028, latitude: -45.8788 }
    });

    if (geocoderRef.current) {
      geocoder.addTo(geocoderRef.current);
    }

    geocoder.on("result", (e) => {
      const selected = e.result;
      const [lng, lat] = selected.center;

      // Extract suburb or city name (if present)
      const context = selected.context || [];
      const locality =
        context.find((c) => c.id.startsWith("place"))?.text || "";
      const region = context.find((c) => c.id.startsWith("region"))?.text || "";

      setFormData((prev) => ({
        ...prev,
        address: selected.place_name,
        location: locality || region,
        coordinates: {
          type: "Point",
          coordinates: [lng, lat]
        }
      }));

      // Update map preview
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo({ center: [lng, lat], zoom: 15 });
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        } else {
          markerRef.current = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(mapInstanceRef.current);
        }
      }
    });

    // Setup minimap
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [170.5028, -45.8788],
        zoom: 12
      });
    }

    return () => {
      geocoder.clear();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.coordinates) {
      alert("Please select an address from the suggestions.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      tags: selectedTags
    };

    try {
      const response = await fetch("/api/addFlat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        alert("Flat added successfully!");
        setFormData({
          flat_name: "",
          address: "",
          location: "",
          rent_per_week: "",
          bond: "",
          rooms: "",
          available_rooms: "",
          features: "",
          description: "",
          tags: "",
          distance_from_uni: "",
          utilities_included: "",
          images: "",
          coordinates: null
        });
        setSelectedTags([]);
      } else {
        alert("Failed to add flat.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Flat</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          maxWidth: "500px"
        }}
      >
        <input
          type="text"
          name="flat_name"
          placeholder="Flat Name"
          value={formData.flat_name}
          onChange={(e) =>
            setFormData({ ...formData, flat_name: e.target.value })
          }
          required
        />

        <div>
          <label>Address (Search):</label>
          <div
            ref={geocoderRef}
            style={{
              minHeight: "48px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          required
        />

        {/* More input fields... */}
        <input
          type="text"
          name="rent_per_week"
          placeholder="Rent per Week"
          value={formData.rent_per_week}
          onChange={(e) =>
            setFormData({ ...formData, rent_per_week: e.target.value })
          }
          required
        />

        <input
          type="text"
          name="bond"
          placeholder="Bond"
          value={formData.bond}
          onChange={(e) => setFormData({ ...formData, bond: e.target.value })}
          required
        />

        <input
          type="text"
          name="rooms"
          placeholder="Total Rooms"
          value={formData.rooms}
          onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
          required
        />

        <input
          type="text"
          name="available_rooms"
          placeholder="Available Rooms"
          value={formData.available_rooms}
          onChange={(e) =>
            setFormData({ ...formData, available_rooms: e.target.value })
          }
          required
        />

        <input
          type="text"
          name="features"
          placeholder="Features"
          value={formData.features}
          onChange={(e) =>
            setFormData({ ...formData, features: e.target.value })
          }
        />

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />

        <input
          type="text"
          name="distance_from_uni"
          placeholder="Distance from University"
          value={formData.distance_from_uni}
          onChange={(e) =>
            setFormData({ ...formData, distance_from_uni: e.target.value })
          }
        />

        <input
          type="text"
          name="utilities_included"
          placeholder="Utilities Included?"
          value={formData.utilities_included}
          onChange={(e) =>
            setFormData({ ...formData, utilities_included: e.target.value })
          }
        />

        <input
          type="text"
          name="images"
          placeholder="Image URL"
          value={formData.images}
          onChange={(e) => setFormData({ ...formData, images: e.target.value })}
        />

        <div>
          <label>Tags:</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {tagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: selectedTags.includes(tag)
                    ? "#4caf50"
                    : "#e0e0e0",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 🗺️ Mini map preview */}
        <div>
          <label>Location Preview:</label>
          <div
            ref={mapRef}
            style={{ height: "300px", width: "100%", borderRadius: "8px" }}
          />
        </div>

        <button type="submit" style={{ padding: "1rem", marginTop: "1rem" }}>
          Submit Flat
        </button>
      </form>
    </div>
  );
};

export default AddFlat;
