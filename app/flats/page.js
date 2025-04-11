"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "../css/flats.scss";
import "../css/globals.scss";

export default function FlatsPage() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFlats = async () => {
      const res = await fetch("/api/getFlats");
      const data = await res.json();
      setFlats(data);
      setLoading(false);
    };
    fetchFlats();
  }, []);

  if (loading) return <p className="p-6">Loading flats...</p>;

  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="title">Browse Available Flats</h2>
        <ul className="flats-list">
          {flats.map((flat) => (
            <li key={flat._id} className="flat-item">
              <img
                src={flat.images || "/thumbnailpic.webp"}
                className="flat-image"
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
