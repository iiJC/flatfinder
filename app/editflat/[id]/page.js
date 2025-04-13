"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EditFlatPage({ params }) {
  const router = useRouter();
  const [flat, setFlat] = useState(null);

  useEffect(() => {
    const fetchFlat = async () => {
      const res = await fetch(`/api/getFlat/${params.id}`);
      const data = await res.json();
      setFlat(data);
    };
    fetchFlat();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/editFlat/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(flat)
    });

    if (res.ok) {
      alert("Flat updated!");
      router.push("/flats");
    } else {
      alert("Failed to update flat.");
    }
  };

  if (!flat) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={flat.address}
        onChange={(e) => setFlat({ ...flat, address: e.target.value })}
      />
      {/* Add more fields like rent, tags, etc. */}
      <button type="submit">Update Flat</button>
    </form>
  );
}
