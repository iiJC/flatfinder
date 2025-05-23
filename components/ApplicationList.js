"use client";

import "../app/css/applicantDashboard.scss";
import "../app/css/globals.scss";

import React, { useState } from "react";

export default function ApplicationList({ initialApplications }) {
  const [applications, setApplications] = useState(initialApplications);

  const handleAcknowledge = async (applicationId) => {
    try {
      const response = await fetch("/api/acknowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (response.ok) {
        setApplications(applications.map(app => 
          app.applicationId === applicationId 
            ? { ...app, status: "acknowledged" } 
            : app
        ));
      }
    } catch (error) {
      console.error("Acknowledge failed:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const response = await fetch("/api/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId }),
      });

      if (response.ok) {
        setApplications(applications.filter(app => 
          app.applicationId !== applicationId
        ));
      }
    } catch (error) {
      console.error("Rejection failed:", error);
    }
  };

  return (
    <ul className="application-list">
      {applications.map((app, index) => (
        <li key={index} className="application-item">
          {/* Applicant Details */}
          <p className="application-name">
            <strong>Name:</strong> {app.name} ({app.email})
          </p>
          <p className="application-message">
            <strong>Message:</strong> {app.message}
          </p>
          <p className="application-referee">
            <strong>Referee Name:</strong> {app.refereeName}
          </p>
          <p className="application-referee">
            <strong>Referee Number:</strong> {app.refereeNumber}
          </p>
          
          {/* Buttons */}
          <div className="button-group">
            <button 
              onClick={() => handleAcknowledge(app.applicationId)}
              disabled={app.status === "acknowledged"}
              className="acknowledge-button"
            >
              {app.status === "acknowledged" 
                ? "✓ Acknowledged" 
                : "Acknowledge"}
            </button>
            
            <button 
              onClick={() => handleReject(app.applicationId)}
              className="reject-button"
            >
              Reject
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}