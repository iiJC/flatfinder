"use client";

import React, { useState, useEffect, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "../../css/applyform.scss";
import "../../css/globals.scss";
import "../../css/flatDetails.scss";

mapboxgl.accessToken = "pk.eyJ1IjoiaHVuYmU4MzMiLCJhIjoiY205Z2Z6Y2IxMWZmdjJscHFiZmJicWNoOCJ9.LxKNU1afAzTYLzx21hAYhQ";

export default function FlatDetailsClient({ flat, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [refereeName, setRefereeName] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: session } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mapRef = useRef(null);

  const [imageStyle, setImageStyle] = useState({
    width: "100%",
    maxHeight: "400px",
    objectFit: "cover",
    borderRadius: "12px",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageStyle((prev) => ({ ...prev, maxHeight: "250px" }));
      } else {
        setImageStyle((prev) => ({ ...prev, maxHeight: "400px" }));
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (flat?.coordinates?.coordinates?.length === 2 && mapRef.current) {
      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: "mapbox://styles/mapbox/satellite-v9",
        center: flat.coordinates.coordinates,
        zoom: 14,
      });

      new mapboxgl.Marker({ color: "#007bff" }).setLngLat(flat.coordinates.coordinates).addTo(map);
    }
  }, [flat]);

  const handleNextImage = () => {
    if (!flat.images || flat.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % flat.images.length);
  };

  const handlePrevImage = () => {
    if (!flat.images || flat.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev === 0 ? flat.images.length - 1 : prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const applicationData = {
      flatId: flat._id,
      address: flat.address,
      message: aboutYou,
      refereeName,
      refereePhone,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
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
    const confirmed = window.confirm("Are you sure you want to delete this flat?");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/deleteFlat/${flat._id}`, {
        method: "DELETE",
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

  const renderImage = () => {
    if (flat.images?.length > 0) {
      const image = flat.images[currentImageIndex];
      return (
        <div className="image-slides">
          <img src={`data:${image.imageType};base64,${image.image}`} alt={`Flat Image ${currentImageIndex + 1}`} style={imageStyle} />
          {flat.images.length > 1 && (
            <>
              <button className="prev"
                onClick={handlePrevImage}>
                ◀
              </button>
              <button className="next"
                onClick={handleNextImage}>
                ▶
              </button>
            </>
          )}
        </div>
      );
    } else {
      return <img src="/thumbnailpic.webp" alt="Flat Image" style={imageStyle} />;
    }
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />

      <div className="flat-details-wrapper">
        <div className="flat-card">
          {renderImage()}
          <div className="mapbox-container"
            ref={mapRef}
          />
          <div className="info" >
            <h1>{flat.address}</h1>
            <p>{flat.description || "No description provided."}</p>

            <div className="info-grid">
              <div>
                <strong>Rooms:</strong> {flat.rooms || "No room numbers provided."}
              </div>
              <div>
                <strong>Available Rooms:</strong> {flat.available_rooms || "N/A"}
              </div>
              <div>
                <strong>Bond:</strong> {flat.bond ? `$${flat.bond}` : "Not specified"}
              </div>
              <div>
                <strong>Rent:</strong> ${flat.rent_per_week}/week
              </div>
              <div>
                <strong>Utilities Included:</strong> {flat.utilities_included || "No info"}
              </div>
              <div>
                <strong>Distance from University:</strong> {flat.distance_from_uni ? `${flat.distance_from_uni} walk` : "Not listed"}
              </div>
              <div>
                <strong>Distance from Supermarket:</strong> {flat.distance_from_supermarket ? `${flat.distance_from_supermarket} walk` : "Not listed"}
              </div>
              <div>
                <strong>Distance from Gym:</strong> {flat.distance_from_gym ? `${flat.distance_from_gym} walk` : "Not listed"}
              </div>
              <div className="tags">
                <strong>Tags:</strong>
                {flat.tags?.length > 0 ? (
                  flat.tags.map((tag, index) => (
                    <span className="tag"
                      key={index}>
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="no-tags">No tags provided.</span>
                )}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "32px",
                justifyContent: "flex-start",
              }}>
              <button
                className="flat-contact-button"
                onClick={() => setShowForm(true)}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  backgroundColor: "#007BFF",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}>
                Apply Here
              </button>
              {showForm && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <h2>Apply for this flat</h2>
                    <form onSubmit={handleSubmit} className="apply-form">
                      <label>
                        Referee Name:
                        <input type="text" value={refereeName} onChange={(e) => setRefereeName(e.target.value)} required />
                      </label>
                      <label>
                        Referee Phone Number:
                        <input type="tel" value={refereePhone} onChange={(e) => setRefereePhone(e.target.value)} required />
                      </label>
                      <label>
                        Tell us more about you:
                        <textarea value={aboutYou} onChange={(e) => setAboutYou(e.target.value)} required />
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
              <button
                onClick={() => (window.location.href = `/editflat/${flat._id}`)}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}>
                Edit Listing
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: "10px 20px",
                  fontSize: "1rem",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}>
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
