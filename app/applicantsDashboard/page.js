import "../css/dashboard.scss";
import "../css/globals.scss";

import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route.js";
import clientPromise from "../../db/database.js";
import { ObjectId } from "mongodb";

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

  // Find the logged-in user based on their email
  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          User not found.
        </h2>
      </div>
    );
  }

  // Assuming the user is interested in the first application (adjust if necessary)
  const flatId = user.listing; // The flatId is stored in the 'listing' field

  if (!flatId) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          No flat associated with your application.
        </h2>
      </div>
    );
  }

  // Fetch the flat details using the flatId from the listing field
  const flat = await db
    .collection("flats")
    .findOne({ _id: new ObjectId(flatId) });

  if (!flat) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">
          Flat not found.
        </h2>
      </div>
    );
  }

  // Retrieve applicants' details based on their _id in the flat document
  const applicants = flat.applicants || [];

  // Fetch user details for each applicant
  const applicantDetails = await Promise.all(
    applicants.map(async (applicantId) => {
      const applicant = await db
        .collection("users")
        .findOne({ _id: new ObjectId(applicantId) });

      return {
        name: applicant?.name,
        email: applicant?.email,
        status: "pending", // You can modify this based on your logic for tracking status
      };
    })
  );

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Applicants for {flat.address}</h2>

      <div className="application-box">
        <h3 className="application-heading">Current Applicants</h3>

        {applicantDetails.length > 0 ? (
          <ul className="application-list">
            {applicantDetails.map((app, index) => (
              <li key={index} className="application-item">
                <p className="application-name">
                  Applicant: {app.name} ({app.email})
                </p>
                <p className={`application-status ${app.status.toLowerCase()}`}>
                  Status:{" "}
                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No applicants found for this flat.</p>
        )}
      </div>
    </div>
  );
}
