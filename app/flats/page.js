"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import "../css/flats.scss";
import "../css/globals.scss";

export default function FlatsPage() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFlats = async () => {
      const res = await fetch("/api/getFlats");
      const data = await res.json();
      setFlats(data);
      setLoading(false);
    };
    fetchFlats();
  }, []);

  const filteredFlats = flats.filter((flat) => {
    const addressMatch = flat.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const tagMatch = flat.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return addressMatch || tagMatch;
  });

  if (loading)
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading flats...</p>
      </div>
    );  

  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="title">Browse Available Flats</h2>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by address or tag..."
          style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%", fontSize: "1rem" }}
        />

        <ul className="flats-list">
          {filteredFlats.map((flat) => (
            <li key={flat._id} className="flat-item">
              <img
                src={
                  flat.images?.[0]
                    ? `data:${flat.images[0].imageType};base64,${flat.images[0].image}`
                    : "/thumbnailpic.webp"
                }
                className="flat-image"
                alt="Flat Image"
              />
              <div className="flat-details">
                <h3 className="flat-id">{flat.address}</h3>
                <p className="flat-info">Location: {flat.location}</p>
                <p className="flat-info">Price: ${flat.rent_per_week}/week</p>
                <p className="flat-info">Rooms: {flat.rooms}</p>
                <Link href={`/flats/${flat._id}`} className="flat-details-link">
                  View Details
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
