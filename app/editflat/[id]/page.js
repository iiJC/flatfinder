"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../css/editFlat.scss";

export default function EditFlatPage() {
  const router = useRouter();
  const params = useParams();
  const [flat, setFlat] = useState(null);
  const [imageStyle, setImageStyle] = useState({});

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const res = await fetch(`/api/getFlat/${params.id}`);
        if (!res.ok) {
          const error = await res.json().catch(() => ({}));
          console.error("Error loading flat:", error);
          alert(error?.error || "Could not load flat.");
          return;
        }
        const data = await res.json();
        setFlat(data);
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Something went wrong loading the flat.");
      }
    };

    fetchFlat();
  }, [params.id]);

  useEffect(() => {
    const handleResize = () => {
      setImageStyle({
        width: window.innerWidth < 768 ? "100%" : "80%",
        maxHeight: window.innerWidth < 768 ? "300px" : "400px",
        objectFit: "cover"
      });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFlat = {
      ...flat,
      tags: typeof flat.tags === "string"
        ? flat.tags.split(",").map((tag) => tag.trim())
        : flat.tags
    };

    const res = await fetch(`/api/editFlat/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFlat)
    });

    if (res.ok) {
      alert("Flat updated!");
      router.push(`/flats/${params.id}`);
    } else {
      alert("Failed to update flat.");
    }
  };

  if (!flat) return <p>Loading...</p>;

  return (
    <div className="edit-flat-page">
      <form className="flat-form" onSubmit={handleSubmit}>
        <h2>Edit your flat listing</h2>
        {[
          { label: "Address", key: "address" },
          { label: "Flat Name", key: "name" },
          { label: "Available Rooms", key: "available_rooms", type: "number" },
          { label: "Description", key: "description", isTextarea: true },
          { label: "Features", key: "features" },
          { label: "Rent Per Week", key: "rent_per_week", type: "number" },
          { label: "Bond", key: "bond", type: "number" },
          {
            label: "Tags (comma separated)",
            key: "tags",
            transform: (val) => Array.isArray(val) ? val.join(", ") : val
          }
        ].map(({ label, key, type = "text", isTextarea, transform }) => (
          <div key={key} className="flat-section">
            <h2>{label}</h2>
            {isTextarea ? (
              <textarea
              value={flat[key] || ""}
              onChange={(e) => setFlat({ ...flat, [key]: e.target.value })}
              />
            ) : (
              <input
              type={type}
              value={transform ? transform(flat[key]) : flat[key] || ""}
              onChange={(e) =>
                setFlat({
                  ...flat,
                  [key]: type === "number" ? Number(e.target.value) : e.target.value
                  })
                }
              />
            )}
          </div>
        ))}

        <button type="submit" className="submit-button">
          Update Flat
        </button>
      </form>
      <div className="flat-hero">
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
    </div>
  );
}
