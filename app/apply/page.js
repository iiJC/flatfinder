import { useState } from "react";

export default function ApplyPage() {
  const [type, setType] = useState("looking_for_flat");

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">Flat Finder Signup</h2>
        <form className="mt-4">
          <label className="block font-bold mt-2">Full Name:</label>
          <input type="text" className="w-full p-2 mt-1 border rounded" required />

          <label className="block font-bold mt-2">Email:</label>
          <input type="email" className="w-full p-2 mt-1 border rounded" required />

          <label className="block font-bold mt-2">Phone Number:</label>
          <input type="tel" className="w-full p-2 mt-1 border rounded" required />

          <label className="block font-bold mt-2">Are you looking for a flat or a flatmate?</label>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="looking_for_flat">Looking for a flat</option>
            <option value="looking_for_flatmate">Looking for a flatmate</option>
          </select>

          <label className="block font-bold mt-2">Location:</label>
          <input type="text" className="w-full p-2 mt-1 border rounded" required />

          {type === "looking_for_flat" && (
            <div>
              <label className="block font-bold mt-2">Budget (per week):</label>
              <input type="number" className="w-full p-2 mt-1 border rounded" />
            </div>
          )}

          {type === "looking_for_flatmate" && (
            <div>
              <label className="block font-bold mt-2">Number of Rooms Available:</label>
              <input type="number" className="w-full p-2 mt-1 border rounded" />
            </div>
          )}

          <label className="block font-bold mt-2">Tell us about yourself:</label>
          <textarea className="w-full p-2 mt-1 border rounded" rows="4" required></textarea>

          <button className="w-full bg-blue-500 text-white p-2 mt-4 rounded hover:bg-blue-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
