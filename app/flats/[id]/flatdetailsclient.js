"use client";

import { useState } from "react";
import "../../css/applyform.scss";

export default function FlatDetailsClient({ flat }) {
  const [showForm, setShowForm] = useState(false);
  const [refereeName, setRefereeName] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [aboutYou, setAboutYou] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ refereeName, refereePhone, aboutYou });
    alert("Application submitted!");
    setShowForm(false);
  };

  return (
    <div className="flat-details-container">
      <div className="flat-hero">
        <img
          src={flat.images || "/thumbnailpic.webp"}
          alt={flat.address}
          className="flat-main-image"
        />
        <div className="flat-hero-overlay">
          <h1 className="flat-hero-title">
            {flat.description || "Flat Listing"}
          </h1>
          <p className="flat-hero-subtitle">{flat.address}</p>
        </div>
      </div>

      <div className="flat-content">
        <div className="flat-main-column">
          <section className="flat-section">
            <h2>About this place</h2>
            <p>{flat.features || "No description provided."}</p>
          </section>

          {flat.tags?.length > 0 && (
            <section className="flat-section">
              <h2>Tags</h2>
              <ul className="flat-tags">
                {flat.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flat-sidebar">
          <div className="flat-price-box">
            <p className="flat-price">${flat.rent_per_week}/week</p>
            <p className="flat-bills">
              {flat.utilities_included || "Bills info not provided"}
            </p>
          </div>
          <button
            className="flat-contact-button"
            onClick={() => setShowForm(true)}
          >
            Apply Here
          </button>
        </aside>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Apply for this flat</h2>
            <form onSubmit={handleSubmit} className="apply-form">
              <label>
                Referee Name:
                <input
                  type="text"
                  value={refereeName}
                  onChange={(e) => setRefereeName(e.target.value)}
                  required
                />
              </label>
              <label>
                Referee Phone Number:
                <input
                  type="tel"
                  value={refereePhone}
                  onChange={(e) => setRefereePhone(e.target.value)}
                  required
                />
              </label>
              <label>
                Tell us more about you:
                <textarea
                  value={aboutYou}
                  onChange={(e) => setAboutYou(e.target.value)}
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
