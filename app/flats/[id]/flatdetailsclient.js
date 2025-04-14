"use client";

import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import "../../css/applyform.scss";

export default function FlatDetailsClient({ flat, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [refereeName, setRefereeName] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const applicationData = {
      flatId: flat._id,
      address: flat.address,
      message: aboutYou,
      refereeName,
      refereePhone
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData)
      });

      if (response.ok) {
        alert("Application submitted!");
        setShowForm(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit application.");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application.");
    }
  };

  const handleApplyClick = () => {
    if (!session?.user?.email) {
      setShowLoginPrompt(true);
    } else {
      setShowForm(true);
    }
  };

  const handleLoginRedirect = () => {
    signIn();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this flat?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/deleteFlat/${flat._id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      if (res.ok) {
        alert("Flat deleted successfully.");
        window.location.href = "/flats";
      } else {
        alert(data.message || "Failed to delete flat.");
      }
    } catch (error) {
      console.error("Error deleting flat:", error);
      alert("Something went wrong.");
    }
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

          <button className="flat-contact-button" onClick={handleApplyClick}>
            Apply Here
          </button>

          <button
            className="flat-edit-button"
            onClick={() => (window.location.href = `/editFlat/${flat._id}`)}
          >
            Edit Listing
          </button>

          {/* 🔴 Delete button */}
          <button className="flat-delete-button" onClick={handleDelete}>
            Delete Listing
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

      {showLoginPrompt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Please log in to apply</h2>
            <p>You need to be logged in to apply for this flat.</p>
            <button onClick={handleLoginRedirect}>Log In</button>
            <button onClick={() => setShowLoginPrompt(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
