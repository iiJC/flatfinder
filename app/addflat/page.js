"use client";

import React, { useState } from "react";

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
    images: ""
  });

  const [selectedTags, setSelectedTags] = useState([]);

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

  const getCoordinates = async (address) => {
    const encodedAddress = encodeURIComponent(address);
    const API_KEY =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg";
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${API_KEY}`
    );
    const data = await res.json();

    if (data && data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      return { latitude: lat, longitude: lon };
    } else {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const coords = await getCoordinates(formData.address);
    if (!coords) {
      alert("Could not get coordinates from address.");
      return;
    }

    const dataToSubmit = {
      ...formData,
      tags: selectedTags,
      coordinates: {
        type: "Point",
        coordinates: [coords.longitude, coords.latitude]
      }
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
          images: ""
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
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          required
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

        <button type="submit" style={{ padding: "1rem", marginTop: "1rem" }}>
          Submit Flat
        </button>
      </form>
    </div>
  );
};

export default AddFlat;
