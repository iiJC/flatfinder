"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { POIS } from "@/lib/pois";
import "mapbox-gl/dist/mapbox-gl.css";

function haversineDistance(coord1, coord2) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AddFlat() {
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
    distance_from_gym: "",
    distance_from_supermarket: "",
    utilities_included: "",
    images: "",
    coordinates: null
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [poiVisibility, setPoiVisibility] = useState({
    gyms: true,
    supermarkets: true,
    university: true
  });

  const geocoderRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderControlRef = useRef(null);
  const userMarkerRef = useRef(null);

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
      container: mapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [170.5028, -45.8788],
      zoom: 13
    });

    if (!geocoderControlRef.current) {
      const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        placeholder: "Search for an address...",
        marker: false,
        countries: "nz",
        proximity: { longitude: 170.5028, latitude: -45.8788 }
      });

      geocoder.addTo(geocoderRef.current);
      geocoderControlRef.current = geocoder;

      geocoder.on("result", (e) => {
        const [lng, lat] = e.result.center;
        const userCoords = { lat, lng };

        const closest = (category) =>
          POIS[category].reduce((closest, poi) => {
            const dist = haversineDistance(userCoords, {
              lat: poi.coordinates[1],
              lng: poi.coordinates[0]
            });
            return !closest || dist < closest.distance
              ? { ...poi, distance: dist }
              : closest;
          }, null);

        const closestGym = closest("gyms");
        const closestSupermarket = closest("supermarkets");
        const closestUni = closest("university");

        // Extract city if available from context
        const context = e.result.context || [];
        const region = context.find((c) => c.id.includes("place"));

        setFormData((prev) => ({
          ...prev,
          address: e.result.place_name,
          location: region?.text || "Dunedin", // default to Dunedin if not found
          coordinates: {
            type: "Point",
            coordinates: [lng, lat]
          },
          distance_from_uni: `${Math.round(closestUni.distance)} m`,
          distance_from_gym: `${Math.round(closestGym.distance)} m`,
          distance_from_supermarket: `${Math.round(
            closestSupermarket.distance
          )} m`
        }));

        if (userMarkerRef.current) {
          userMarkerRef.current.remove();
        }

        userMarkerRef.current = new mapboxgl.Marker({ color: "#111" })
          .setLngLat([lng, lat])
          .addTo(map);
      });
    }

    map.on("load", () => {
      Object.entries(POIS).forEach(([category, pois]) => {
        if (poiVisibility[category]) {
          pois.forEach((poi) => {
            new mapboxgl.Marker({ color: getPoiColor(category) })
              .setLngLat(poi.coordinates)
              .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
              .addTo(map);
          });
        }
      });
    });
  }, [poiVisibility]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coordinates) {
      alert("Please select a valid address from suggestions.");
      return;
    }

    const form = new FormData();

    // Append all regular fields
    for (const [key, value] of Object.entries(formData)) {
      if (key === "coordinates") {
        form.append("coordinates", JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    }

    // Append tags
    selectedTags.forEach((tag) => form.append("tags[]", tag));

    // Append image files
    if (formData.images && formData.images.length > 0) {
      Array.from(formData.images).forEach((file) => {
        form.append("images", file);
      });
    }

    try {
      const response = await fetch("/api/addFlat", {
        method: "POST",
        body: form
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
          distance_from_gym: "",
          distance_from_supermarket: "",
          utilities_included: "",
          images: "",
          coordinates: null
        });
        setSelectedTags([]);
      } else {
        alert("Failed to add flat.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("An error occurred.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Add Flat</h1>
      <div>
        <strong>Toggle POI Categories:</strong>
        {Object.keys(poiVisibility).map((category) => (
          <label key={category} style={{ marginLeft: "1rem" }}>
            <input
              type="checkbox"
              checked={poiVisibility[category]}
              onChange={(e) =>
                setPoiVisibility((prev) => ({
                  ...prev,
                  [category]: e.target.checked
                }))
              }
            />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </label>
        ))}
      </div>
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
            style={{ minHeight: "48px", border: "1px solid #ccc" }}
          />
        </div>
        <div
          ref={mapRef}
          style={{ height: "300px", marginBottom: "1rem", borderRadius: "8px" }}
        />
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
          value={formData.distance_from_uni}
          placeholder="Distance from University"
          name="distance_from_uni"
          readOnly
        />
        <input
          type="text"
          value={formData.distance_from_gym}
          placeholder="Distance from Gym"
          name="distance_from_gym"
          readOnly
        />
        <input
          type="text"
          value={formData.distance_from_supermarket}
          placeholder="Distance from Supermarket"
          name="distance_from_supermarket"
          readOnly
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
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setFormData({ ...formData, images: e.target.files });
          }}
        />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "10px"
          }}
        >
          {formData.images &&
            Array.from(formData.images).map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "8px"
                }}
              />
            ))}
        </div>

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

        <button type="submit" style={{ padding: "1rem", marginTop: "1rem" }}>
          Submit Flat
        </button>
      </form>
    </div>
  );
}
