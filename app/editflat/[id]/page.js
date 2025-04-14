"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditFlatPage() {
  const router = useRouter();
  const params = useParams();
  const [flat, setFlat] = useState(null);
  const [imageStyle, setImageStyle] = useState({
    width: "80%",
    maxHeight: "400px",
    objectFit: "cover"
  });

  useEffect(() => {
    if (!params?.id) return;

    const fetchFlat = async () => {
      const res = await fetch(`/api/getFlat/${params.id}`);
      const data = await res.json();
      setFlat(data);
    };
    fetchFlat();
  }, [params?.id]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setImageStyle({
          width: "100%",
          maxHeight: "300px",
          objectFit: "cover"
        });
      } else {
        setImageStyle({
          width: "80%",
          maxHeight: "400px",
          objectFit: "cover"
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFlat = {
      ...flat,
      tags:
        typeof flat.tags === "string"
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
    <div
      className="flat-details-container"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop: "100px",
        textAlign: "center",
        flexDirection: "column"
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
          zIndex: 1
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

      <form
        onSubmit={handleSubmit}
        style={{
          marginTop: "2rem",
          width: "90%",
          maxWidth: "600px",
          display: "flex",
          flexDirection: "column",
          gap: "1rem"
        }}
      >
        <div className="flat-section">
          <h2>Address</h2>
          <input
            type="text"
            value={flat.address || ""}
            onChange={(e) => setFlat({ ...flat, address: e.target.value })}
          />
        </div>

        <div className="flat-section">
          <h2>Flat Name</h2>
          <input
            type="text"
            value={flat.flat_name || ""}
            onChange={(e) => setFlat({ ...flat, flat_name: e.target.value })}
          />
        </div>

        <div className="flat-section">
          <h2>Available Rooms</h2>
          <input
            type="number"
            value={flat.available_rooms || ""}
            onChange={(e) =>
              setFlat({ ...flat, available_rooms: Number(e.target.value) })
            }
          />
        </div>

        <div className="flat-section">
          <h2>Description</h2>
          <textarea
            value={flat.description || ""}
            onChange={(e) => setFlat({ ...flat, description: e.target.value })}
          />
        </div>

        <div className="flat-section">
          <h2>Features</h2>
          <input
            type="text"
            value={flat.features || ""}
            onChange={(e) => setFlat({ ...flat, features: e.target.value })}
          />
        </div>

        <div className="flat-section">
          <h2>Rent Per Week</h2>
          <input
            type="number"
            value={flat.rent_per_week || ""}
            onChange={(e) =>
              setFlat({ ...flat, rent_per_week: Number(e.target.value) })
            }
          />
        </div>

        <div className="flat-section">
          <h2>Bond</h2>
          <input
            type="number"
            value={flat.bond || ""}
            onChange={(e) => setFlat({ ...flat, bond: Number(e.target.value) })}
          />
        </div>

        <div className="flat-section">
          <h2>Tags (comma separated)</h2>
          <input
            type="text"
            value={Array.isArray(flat.tags) ? flat.tags.join(", ") : flat.tags}
            onChange={(e) => setFlat({ ...flat, tags: e.target.value })}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Update Flat
        </button>
      </form>
    </div>
  );
}
