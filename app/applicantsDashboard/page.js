import "../css/dashboard.scss";
import "../css/globals.scss";

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import clientPromise from "../../db/database.js";

export default async function ApplicantsDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Please log in to view your applicants.
        </h2>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");

  // Get flats owned by the current user
  const flats = await db
    .collection("flats")
    .find({ ownerEmail: session.user.email }) // assumes `ownerEmail` exists
    .toArray();

  const applicants = flats.flatMap(flat =>
    (flat.applicants || []).map(app => ({
      flatAddress: flat.address,
      applicantEmail: app.email,
      applicantName: app.name,
      status: app.status,
    }))
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Applicants</h2>

      <div className="application-box">
        <h3 className="application-heading">Flat Applicants</h3>

        {applicants.length > 0 ? (
          <ul className="application-list">
            {applicants.map((app, index) => (
              <li key={index} className="application-item">
                <p className="application-name">
                  Flat Address: {app.flatAddress}
                </p>
                <p className="application-name">Applicant: {app.applicantName} ({app.applicantEmail})</p>
                <p className={`application-status ${app.status.toLowerCase()}`}>
                  Status:{" "}
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applicants found for your flats.</p>
        )}
      </div>
    </div>
  );
}
