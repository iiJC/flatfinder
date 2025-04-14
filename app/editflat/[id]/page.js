"use client";

import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditFlatPage({ params }) {
  const router = useRouter();
  const [flat, setFlat] = useState(null);
  const [imageStyle, setImageStyle] = useState({
    width: "80%",
    maxHeight: "400px",
    objectFit: "cover"
  });

  useEffect(() => {
    const fetchFlat = async () => {
      const res = await fetch(`/api/getFlat/${params.id}`);
      const data = await res.json();
      setFlat(data);
    };
    fetchFlat();
  }, [params.id]);

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
      className="edit-flat-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "100px",
        textAlign: "center"
      }}
    >
      <img
        src={
          flat.images?.[0]
            ? `data:${flat.images[0].imageType};base64,${flat.images[0].image}`
            : "/thumbnailpic.webp"
        }
        alt="Flat Image"
        style={imageStyle}
      />

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
        <label>
          Address:
          <input
            type="text"
            value={flat.address || ""}
            onChange={(e) => setFlat({ ...flat, address: e.target.value })}
          />
        </label>

        <label>
          Flat Name:
          <input
            type="text"
            value={flat.flat_name || ""}
            onChange={(e) => setFlat({ ...flat, flat_name: e.target.value })}
          />
        </label>

        <label>
          Description:
          <textarea
            value={flat.description || ""}
            onChange={(e) => setFlat({ ...flat, description: e.target.value })}
          />
        </label>

        <label>
          Features:
          <input
            type="text"
            value={flat.features || ""}
            onChange={(e) => setFlat({ ...flat, features: e.target.value })}
          />
        </label>

        <label>
          Rent Per Week:
          <input
            type="number"
            value={flat.rent_per_week || ""}
            onChange={(e) =>
              setFlat({ ...flat, rent_per_week: Number(e.target.value) })
            }
          />
        </label>

        <label>
          Bond:
          <input
            type="number"
            value={flat.bond || ""}
            onChange={(e) => setFlat({ ...flat, bond: Number(e.target.value) })}
          />
        </label>

        <label>
          Available Rooms:
          <input
            type="number"
            value={flat.available_rooms || ""}
            onChange={(e) =>
              setFlat({ ...flat, available_rooms: Number(e.target.value) })
            }
          />
        </label>

        <label>
          Tags (comma separated):
          <input
            type="text"
            value={Array.isArray(flat.tags) ? flat.tags.join(", ") : flat.tags}
            onChange={(e) => setFlat({ ...flat, tags: e.target.value })}
          />
        </label>

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
