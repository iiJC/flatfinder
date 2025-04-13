"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../css/applyPage.scss";
import "../../../css/globals.scss";

export default function ApplyPage() {
  const [type, setType] = useState("looking_for_flat");
  const [flat, setFlat] = useState(null);
  const { id } = useParams(); // grab the flat ID from the URL

  useEffect(() => {
    const fetchFlat = async () => {
      const res = await fetch(`/api/flats/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFlat(data);
      }
    };

    if (id) {
      fetchFlat();
    }
  }, [id]);

  return (
    <div className="apply-container">
      <div className="apply-box">
        <h2 className="title">
          Apply {flat ? `for ${flat.address}` : "for this flat"}
        </h2>

        <form className="apply-form">
          <label>Full Name:</label>
          <input type="text" required />

          <label>Email:</label>
          <input type="email" required />

          <label>Phone Number:</label>
          <input type="tel" required />

          <label>Reference Name:</label>
          <input type="text" required />

          <label>Reference Phone Number:</label>
          <input type="tel" required />

          
          <label>Tell us about yourself:</label>
          <textarea rows="4" required></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
