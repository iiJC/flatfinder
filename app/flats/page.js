"use client";

import "../css/flats.scss";
import "../css/globals.scss";
import Link from "next/link";

const mockFlats = [
  {
    _id: "flat1",
    address: "123 Castle Street",
    location: "North Dunedin",
    rent_per_week: 220,
    rooms: 3,
    tags: ["Party", "Furnished"],
    images: "/thumbnailpic.webp"
  },
  {
    _id: "flat2",
    address: "456 Leith Street",
    location: "Central Dunedin",
    rent_per_week: 250,
    rooms: 4,
    tags: ["Quiet", "Fibre internet"],
    images: "/thumbnailpic.webp"
  }
];

export default function FlatsPage() {
  const flats = mockFlats; // No need for state or fetch
  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="title">Browse Available Flats</h2>

        <ul className="flats-list">
          {flats.map((flat) => (
            <li key={flat._id} className="flat-item">
              <img
                src={flat.images || "/thumbnailpic.webp"}
                alt={`Flat in ${flat.location}`}
                className="flat-image"
              />
              <div className="flat-details">
                <h3 className="flat-id">Flat ID: {flat._id.slice(-5)}</h3>
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
