"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import "../../../css/applyPage.scss";
import "../../../css/globals.scss";

export default function ApplyPage() {
  const [type, setType] = useState("looking_for_flat");
  const [flat, setFlat] = useState(null);
  const { id } = useParams(); // Flat ID from the URL

  // Simulate logged-in user for now (replace with session user in production)
  const userId = "661aeb26d5e3fe01338cc999"; // John Doe

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    refName: "",
    refPhone: "",
    message: "",
  });

  useEffect(() => {
    const fetchFlat = async () => {
      const res = await fetch(`/api/flats/${id}`);
      if (res.ok) {
        const data = await res.json();
        setFlat(data);
      }
    };

    if (id) fetchFlat();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        flatId: id,
        address: flat?.address,
        message: formData.message,
      }),
    });
  
    if (res.ok) {
      alert("Application submitted!");
    } else {
      alert("Error submitting application");
    }
  };
  

  return (
    <div className="apply-container">
      <div className="apply-box">
        <h2 className="title">
          Apply {flat ? `for ${flat.address}` : "for this flat"}
        </h2>

        <form className="apply-form" onSubmit={handleSubmit}>
          <label>Full Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Phone Number:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />

          <label>Reference Name:</label>
          <input type="text" name="refName" value={formData.refName} onChange={handleChange} required />

          <label>Reference Phone Number:</label>
          <input type="tel" name="refPhone" value={formData.refPhone} onChange={handleChange} required />

          <label>Tell us about yourself:</label>
          <textarea name="message" value={formData.message} onChange={handleChange} rows="4" required />

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
