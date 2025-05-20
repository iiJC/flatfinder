import "../css/dashboard.scss";
import "../css/globals.scss";

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import clientPromise from "../../db/database.js";
import { ObjectId } from "mongodb";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">Please log in to view your applications.</h2>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");

  // Get current user
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">User not found.</h2>
      </div>
    );
  }

  // Get applications where the user is the applicant
  const applications = await db.collection("applications").find({ applicantId: user._id }).toArray();

  // Fetch flat details for each application
  const applicationDetails = await Promise.all(
    applications.map(async (app) => {
      const flat = await db.collection("flats").findOne({ _id: new ObjectId(app.flatId) });

      return {
        flatAddress: flat?.address || "Unknown address",
        status: app.status || "Pending", // Default to "Pending" if not stored
      };
    })
  );

  
  let bookmarkedFlats = [];
  if (user.bookmarks && user.bookmarks.length > 0) {
    bookmarkedFlats = await db
      .collection("flats")
      .find({ _id: { $in: user.bookmarks.map((id) => new ObjectId(id)) } })
      .toArray();
  }

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Applications</h2>

      <div className="application-box">
        <h3 className="application-heading">Current Applications</h3>

        {applicationDetails.length > 0 ? (
          <ul className="application-list">
            {applicationDetails.map((app, index) => (
              <li key={index} className="application-item">
                <p className="application-name">
                  <strong>Flat Address:</strong> {app.flatAddress}
                </p>
                <p className={`application-status ${app.status.toLowerCase()}`}>
                  <strong>Status:</strong>{" "}
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}
      </div>
  
      <div className="bookmark-box">
        <h3 className="application-heading">Bookmarked Flats</h3>
        {bookmarkedFlats.length > 0 ? (
          <ul className="application-list">
            {bookmarkedFlats.map((flat) => (
              <li key={flat._id} className="application-item">
                <a href={`/flats/${flat._id}`}>
                  <strong>{flat.title || flat.address || "Flat"}</strong>
                </a>
                {flat.address && (
                  <p className="application-name">
                    <strong>Address:</strong> {flat.address}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookmarks yet.</p>
        )}
      </div>
    </div>
  );
}
