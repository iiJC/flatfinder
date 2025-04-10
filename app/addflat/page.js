"use client";

import { useState } from "react";
import "../css/addFlat.scss";
import "../css/globals.scss";
import TagSelector from "@/components/TagSelector";

export default function AddFlat() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]); 

  const [formData, setFormData] = useState({
    _id: "",
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
    listed_date: "",
    latitude: "",
    longitude: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressChange = async (e) => {
    const addressInput = e.target.value;
    setFormData({ ...formData, address: addressInput });

    if (addressInput.length > 2) {
      const accessToken =
        "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg"; // Replace with your Mapbox access token
      
      const centerLatitude = -45.8788; // Dunedin 
      const centerLongitude = 170.5028; // Dunedin

      const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        addressInput
      )}.json?access_token=${accessToken}&proximity=${centerLongitude},${centerLatitude}`;

      try {
        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.features.length > 0) {
          const suggestions = data.features.map((feature) => feature.place_name);
          setAddressSuggestions(suggestions);
        } else {
          setAddressSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
      }
    } else {
      setAddressSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, address: suggestion });
    setAddressSuggestions([]); 
  };

  const getCoordinates = async (address) => {
    const accessToken =
      "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY204cGQ3MTBzMGEyeTJpcTB4ZWJodHdpNSJ9.Y3jD8AYlV8fY3TKp3RHccg"; // Replace with your Mapbox access token
    const endpoint = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address + " Dunedin"
    )}.json?access_token=${accessToken}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        return { latitude: coordinates[1], longitude: coordinates[0] };
      } else {
        throw new Error("Address not found");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Failed to get coordinates");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get coordinates for the address
    const { latitude, longitude } = await getCoordinates(formData.address);

    if (!latitude || !longitude) {
      alert("Unable to fetch coordinates");
      return;
    }

    // Add the coordinates to the form data
    const dataToSubmit = {
      ...formData,
      tags: selectedTags,
      latitude,
      longitude
    };

    try {
      const response = await fetch("/api/addFlat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dataToSubmit)
      });
      if (response.ok) {
        alert("Flat added successfully!");
        setFormData({
          _id: "",
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
          listed_date: "",
          latitude: "",
          longitude: ""
        });
      } else {
        alert("Failed to add flat.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while adding the flat.");
    }
  };

  return (
    <div className="add-flat-container">
      <h1 className="title">List Your Flat</h1>
      <form className="add-flat-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>ID:</label>
            <input
              type="text"
              name="_id"
              value={formData._id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleAddressChange}
              required
            />
            {addressSuggestions.length > 0 && (
              <ul className="address-suggestions">
                {addressSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Rent per Week:</label>
            <input
              type="number"
              name="rent_per_week"
              value={formData.rent_per_week}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Bond:</label>
            <input
              type="number"
              name="bond"
              value={formData.bond}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Rooms:</label>
            <input
              type="number"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Available Rooms:</label>
            <input
              type="number"
              name="available_rooms"
              value={formData.available_rooms}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Features:</label>
            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="e.g., Furnished, Balcony"
            />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tags:</label>
            <TagSelector
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>
          <div className="form-group">
            <label>Flat Name:</label>
            <input
              type="text"
              name="name"
              value={formData.flat_name}
              onChange={handleChange}
              placeholder="e.g., Debacle, Fridgette"
            />
          </div>
          <div className="form-group">
            <label>Distance from University:</label>
            <input
              type="text"
              name="distance_from_uni"
              value={formData.distance_from_uni}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Utilities Included:</label>
            <input
              type="text"
              name="utilities_included"
              value={formData.utilities_included}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Images (URLs):</label>
            <input
              type="text"
              name="images"
              value={formData.images}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Listed Date:</label>
            <input
              type="date"
              name="listed_date"
              value={formData.listed_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <button className="submit-button" type="submit">
          Add Flat
        </button>
      </form>
    </div>
  );
}
