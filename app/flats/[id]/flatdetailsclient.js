"use client";

import React, { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import "../../css/applyform.scss";

export default function FlatDetailsClient({ flat, userId }) {
  const [showForm, setShowForm] = useState(false);
  const [refereeName, setRefereeName] = useState("");
  const [refereePhone, setRefereePhone] = useState("");
  const [aboutYou, setAboutYou] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { data: session } = useSession();
  const [imageStyle, setImageStyle] = useState({
    width: "80%",
    maxHeight: "400px",
    objectFit: "cover",
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageStyle({
          width: "100%",
          maxHeight: "300px",
          objectFit: "cover",
        });
      } else {
        setImageStyle({
          width: "80%",
          maxHeight: "400px",
          objectFit: "cover",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const confirmed = window.confirm(
      "Are you sure you want to delete this flat?"
    );
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

  return (
    <div
      className="flat-details-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "100px",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <div
        className="flat-hero"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginBottom: "20px",
          marginTop: "20px",
          flexDirection: "column",
          zIndex: 1,
        }}
      >
        <img
          src={
            flat.images?.[0]
              ? `data:${flat.images[0].imageType};base64,${flat.images[0].image}`
              : "/thumbnailpic.webp"
          }
          alt="Flat Image"
          className="flat-main-image"
          style={imageStyle}
        />
      </div>

      <div
        className="flat-content"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <div
          className="flat-main-column"
          style={{
            padding: "1rem",
            textAlign: "center",
            width: "100%",
            maxWidth: "900px",
          }}
        >
          <section className="flat-section" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Address</h2>
            <p style={{ fontSize: "1rem", color: "#777" }}>
              {flat.address || "Address not provided."}
            </p>
          </section>

          <section className="flat-section" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Rooms</h2>
            <p style={{ fontSize: "1rem" }}>
              {flat.rooms || "No room numbers provided."}
            </p>
          </section>

          <section className="flat-section" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>About The Flat</h2>
            <p style={{ fontSize: "1rem" }}>
              {flat.description || "No description provided."}
            </p>
          </section>

          <section className="flat-section" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Features</h2>
            <p style={{ fontSize: "1rem", color: "#777" }}>
              <strong>Utilities Included: </strong>
              {flat.utilities_included || "No utilities info provided."}
            </p>
          </section>

          <section className="flat-section" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.25rem" }}>Tags</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {flat.tags?.length > 0 ? (
                flat.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: "#007BFF",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "15px",
                      fontSize: "0.9rem",
                    }}
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p>No tags provided.</p>
              )}
            </div>
          </section>
        </div>

        <aside
          className="flat-sidebar"
          style={{
            textAlign: "center",
            marginTop: "20px",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <div className="flat-price-box" style={{ marginBottom: "20px", padding: "10px", borderRadius: "8px", border: "1px solid #ddd", backgroundColor: "#f9f9f9" }}>
            <p className="flat-price" style={{ fontSize: "1.75rem", fontWeight: "bold", color: "#007BFF" }}>
              ${flat.rent_per_week}/week
            </p>
          </div>

          <button
            className="flat-contact-button"
            onClick={handleApplyClick}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#007BFF",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            Apply Here
          </button>

          <button
            className="flat-edit-button"
            onClick={() => (window.location.href = `/editFlat/${flat._id}`)}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginBottom: "10px",
            }}
          >
            Edit Listing
          </button>

          <button
            className="flat-delete-button"
            onClick={handleDelete}
            style={{
              padding: "10px 20px",
              fontSize: "1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Delete Listing
          </button>
        </aside>
      </div>
    </div>
  );
}
