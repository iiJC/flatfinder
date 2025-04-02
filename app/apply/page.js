"use client";

import { useState } from "react";
import "../css/applyPage.scss"; 

export default function ApplyPage() {
  const [type, setType] = useState("looking_for_flat");

  return (
    <div className="apply-container">
      <div className="apply-box">
        <h2 className="apply-title">Flat Finder Signup</h2>
        <form className="apply-form">
          <label>Full Name:</label>
          <input type="text" required />

          <label>Email:</label>
          <input type="email" required />

          <label>Phone Number:</label>
          <input type="tel" required />

          <label>Are you looking for a flat or a flatmate?</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="looking_for_flat">Looking for a flat</option>
            <option value="looking_for_flatmate">Looking for a flatmate</option>
          </select>

          <label>Location:</label>
          <input type="text" required />

          {type === "looking_for_flat" && (
            <div>
              <label>Budget (per week):</label>
              <input type="number" />
            </div>
          )}

          {type === "looking_for_flatmate" && (
            <div>
              <label>Number of Rooms Available:</label>
              <input type="number" />
            </div>
          )}

          <label>Tell us about yourself:</label>
          <textarea rows="4" required></textarea>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
