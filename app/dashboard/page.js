import "../css/dashboard.scss";
import "../css/globals.scss";

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import clientPromise from "../../db/database.js"; // your existing connection
import { ObjectId } from "mongodb";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Please log in to view your applications.
        </h2>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const user = await db
    .collection("users")
    .findOne({ email: session.user.email });

  const applications = user?.applications || [];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Applications</h2>

      <div className="application-box">
        <h3 className="application-heading">Current Applications</h3>

        {applications.length > 0 ? (
          <ul className="application-list">
            {applications.map((app, index) => (
              <li key={index} className="application-item">
                <p className="application-name">
                  Flat Address: {app.address.toString()}
                </p>
                <p className={`application-status ${app.status.toLowerCase()}`}>
                  Status:{" "}
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applications found.</p>
        )}
      </div>
    </div>
  );
}
