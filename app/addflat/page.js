'use client';

import { useState } from 'react';

export default function AddFlat() {
  const [formData, setFormData] = useState({
    _id: '',
    address: '',
    location: '',
    rent_per_week: '',
    bond: '',
    rooms: '',
    available_rooms: '',
    features: '',
    description: '',
    tags: '',
    distance_from_uni: '',
    utilities_included: '',
    images: '',
    listed_date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/addFlat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Flat added successfully!');
        setFormData({
          _id: '',
          address: '',
          location: '',
          rent_per_week: '',
          bond: '',
          rooms: '',
          available_rooms: '',
          features: '',
          description: '',
          tags: '',
          distance_from_uni: '',
          utilities_included: '',
          images: '',
          listed_date: '',
        });
      } else {
        alert('Failed to add flat.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding the flat.');
    }
  };

  return (
    <div>
      <h1>Add a New Flat</h1>
      <form onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" name="_id" value={formData._id} onChange={handleChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={formData.address} onChange={handleChange} required />
        </label>
        <label>
          Location:
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </label>
        <label>
          Rent per Week:
          <input type="number" name="rent_per_week" value={formData.rent_per_week} onChange={handleChange} required />
        </label>
        <label>
          Bond:
          <input type="number" name="bond" value={formData.bond} onChange={handleChange} required />
        </label>
        <label>
          Rooms:
          <input type="number" name="rooms" value={formData.rooms} onChange={handleChange} required />
        </label>
        <label>
          Available Rooms:
          <input type="number" name="available_rooms" value={formData.available_rooms} onChange={handleChange} required />
        </label>
        <label>
          Features (comma-separated):
          <input type="text" name="features" value={formData.features} onChange={handleChange} />
        </label>
        <label>
          Description:
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>
        <label>
          Tags (comma-separated):
          <input type="text" name="tags" value={formData.tags} onChange={handleChange} />
        </label>
        <label>
          Distance from University:
          <input type="text" name="distance_from_uni" value={formData.distance_from_uni} onChange={handleChange} required />
        </label>
        <label>
          Utilities Included (comma-separated):
          <input type="text" name="utilities_included" value={formData.utilities_included} onChange={handleChange} />
        </label>
        <label>
          Images (comma-separated URLs):
          <input type="text" name="images" value={formData.images} onChange={handleChange} />
        </label>
        <label>
          Listed Date:
          <input type="date" name="listed_date" value={formData.listed_date} onChange={handleChange} required />
        </label>
        <button type="submit">Add Flat</button>
      </form>
    </div>
  );
}