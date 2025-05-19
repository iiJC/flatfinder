import "../css/applicantDashboard.scss";
import "../css/globals.scss";
import ApplicationList from "../../components/ApplicationList";

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
        <h2 className="dashboard-title">Please log in to view your applicants.</h2>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");

  const user = await db.collection("users").findOne({ email: session.user.email });

  if (!user) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">User not found.</h2>
      </div>
    );
  }

  const flatId = user.listing;

  if (!flatId) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">You have not listed a flat.</h2>
      </div>
    );
  }

  const flat = await db.collection("flats").findOne({ _id: new ObjectId(flatId) });

  if (!flat) {
    return (
      <div className="dashboard-container">
        <h2 className="dashboard-title">Flat not found.</h2>
      </div>
    );
  }

  const applications = await db.collection("applications").find({ flatId: new ObjectId(flatId) }).toArray();

  const applicantDetails = await Promise.all(
    applications.map(async (app) => {
      const applicant = await db.collection("users").findOne({ _id: new ObjectId(app.applicantId) });

      return {
        applicationId: app._id.toString(),
        status: app.status,
        name: applicant?.name || "Unknown",
        email: applicant?.email || "Unknown",
        message: app.message || "No message provided",
        refereeName: app.refereeName || "N/A",
        refereeNumber: app.refereePhone || "N/A",
      };
    })
  );


  return (
    <div className="application-box">
      <h3 className="application-heading">Current Applicants</h3>
      {applicantDetails.length > 0 ? (
        <ApplicationList initialApplications={applicantDetails} />
      ) : (
        <p>No applicants found for this flat.</p>
      )}
    </div>
  );
}
