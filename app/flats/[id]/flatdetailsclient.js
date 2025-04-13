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

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    address: flat.address || "",
    description: flat.description || "",
    rent_per_week: flat.rent_per_week || "",
    features: flat.features || "",
    tags: flat.tags?.join(", ") || ""
  });

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
        headers: {
          "Content-Type": "application/json"
        },
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

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/editFlat", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: flat._id,
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim())
      })
    });

    if (response.ok) {
      alert("Flat updated successfully.");
      setEditMode(false);
      location.reload();
    } else {
      alert("Failed to update flat.");
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

      <div style={{ padding: "1rem" }}>
        {!editMode ? (
          <button
            className="flat-contact-button"
            onClick={() => setEditMode(true)}
          >
            ✏️ Edit Flat
          </button>
        ) : (
          <form className="edit-flat-form" onSubmit={handleEditSubmit}>
            <label>
              Address:
              <input
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </label>
            <label>
              Description:
              <input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </label>
            <label>
              Rent per week:
              <input
                type="number"
                value={formData.rent_per_week}
                onChange={(e) =>
                  setFormData({ ...formData, rent_per_week: e.target.value })
                }
              />
            </label>
            <label>
              Features:
              <input
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
              />
            </label>
            <label>
              Tags (comma-separated):
              <input
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
              />
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </form>
        )}
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
