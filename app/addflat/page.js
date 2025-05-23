"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import { POIS } from "@/lib/pois";
import "mapbox-gl/dist/mapbox-gl.css";
import "../css/globals.scss";
import "../css/addFlat.scss";

// helper to calculate distance between two coordinates
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
  // state for form data
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
  // state for tag selection and poi toggle
  const [selectedTags, setSelectedTags] = useState([]);
  const [poiVisibility, setPoiVisibility] = useState({
    gyms: true,
    supermarkets: true,
    university: true
  });

  // refs for map, geocoder, and marker
  const geocoderRef = useRef(null);
  const mapRef = useRef(null);
  const geocoderControlRef = useRef(null);
  const userMarkerRef = useRef(null);

  // tag options
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

  // toggle tags on/off
  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // icon emoji for each poi category
  const getPoiColor = (category) => {
    switch (category) {
      case "gyms":
        return "🏋️";
      case "supermarkets":
        return "🛒";
      case "university":
        return "🎓";
      default:
        return "#aaa";
    }
  };

  // place pois on map
  const addPOIsToMap = (map, pois) => {
    Object.entries(pois).forEach(([category, poiList]) => {
      if (poiVisibility[category]) {
        poiList.forEach((poi) => {
          const el = document.createElement("div");
          el.className = "custom-marker";
          el.textContent = getPoiColor(category);
          el.style.fontSize = "20px";
          el.style.width = "36px";
          el.style.height = "36px";
          el.style.background = "#fff";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent = "center";
          el.style.borderRadius = "50%";
          el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
          el.style.cursor = "pointer";

          new mapboxgl.Marker(el)
            .setLngLat(poi.coordinates)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(poi.name))
            .addTo(map);
        });
      }
    });
  };

  const [modalMessage, setModalMessage] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = (message) => {
    setModalMessage(message);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setModalMessage("");
  };

  // initialize map and geocoder
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY205Z2Z6Y2IxMWZmdjJscHFiZmJicWNoOCJ9.LxKNU1afAzTYLzx21hAYhQ";

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [170.510085, -45.869802],
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

      // update form data when user selects an address
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

    // add pois when map loads
    map.on("load", () => {
      addPOIsToMap(map, POIS);
    });
  }, [poiVisibility]);

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coordinates) {
      showModal("Please select a valid address from suggestions.");
      return;
    }

    const form = new FormData();

    // append all regular fields
    for (const [key, value] of Object.entries(formData)) {
      if (key === "coordinates") {
        form.append("coordinates", JSON.stringify(value));
      } else {
        form.append(key, value);
      }
    }

    // append tags
    selectedTags.forEach((tag) => form.append("tags[]", tag));

    // append image files
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
        showModal("Flat added successfully!");
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
        showModal("Failed to add flat.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      showModal("An error occurred.");
    }
  };

  // main render
  return (
    <div className="add-flat-container">
      <h1>Add Flat</h1>
      <div className="POI">
        <strong>Toggle POI Categories:</strong>
        {Object.keys(poiVisibility).map((category) => (
          <label key={category}>
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
      <form className="add-flat-form" onSubmit={handleSubmit}>
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
        <div className="address">
          <div>
            <label>Address (Search):</label>
            <div ref={geocoderRef} />
          </div>
          <div className="map" ref={mapRef} />
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
          className="file-input"
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            setFormData({ ...formData, images: e.target.files });
          }}
        />

        <div className="image-preview">
          {formData.images &&
            Array.from(formData.images).map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
              />
            ))}
        </div>

        <div>
          <label>Tags:</label>
          <div className="tags">
            {tagOptions.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => handleTagToggle(tag)}
                style={{
                  backgroundColor: selectedTags.includes(tag)
                    ? "#4caf50"
                    : "#e0e0e0"
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-button">
          Submit Flat
        </button>
      </form>
      {isModalVisible && (
        <div className="custom-modal-overlay">
          <div className="custom-modal">
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
