"use client";

import React from "react";
import "./css/globals.scss";
import "./css/homePage.scss";
import Link from "next/link";

// TODO images are on icloud, upload and save them to the repo...
export default function HomePage() {
  return (
    <div className="home-page">
      {/* Link these to the correct pages */}
      <div className="buttons-container">
        <h2 className="title">Welcome to FlatMate Finder, are you...</h2>
        <div className="cards">
          <div className="card looking-flat">
            <p>Looking for a flat?</p>
            <div className="overlay">
              <Link href="/flats" className="button button-flat">
                Find a flat!
              </Link>
            </div>
          </div>

          <div className="card looking-flatmate">
            <p>Looking for a flat mate?</p>
            <div className="overlay">
              <Link href="/addflat" className="button button-flatmate">
                Find a flatmate!
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="details">
        <div className="info students">
          <h2>Perfect for students (inclusive)</h2>
          <p>
            Looking for a place that fits your lifestyle and budget? Whether you're studying, working, or just starting out, we've got listings to suit every need. Inclusive,
            affordable, and easy to search.
          </p>
        </div>
        <div className="info pos-flats">
          <h2>Look at These Possible Flats</h2>
          <p>
          Browse our handpicked flats with clear photos, upfront details, and filters that help you find the right match fast. No clutter—just places worth considering.
          </p>
        </div>
        <div className="info check-map">
          <h2>Check the Map</h2>
          <p>
          Want to live close to uni, work, or the best coffee spots? Use our interactive map to see exactly where each flat is, plus what’s nearby.
          </p>
        </div>
        <div className="info admin">
          <h2>Admin Made Easy</h2>
          <p>
          Say goodbye to paperwork stress. From booking viewings to messaging landlords, we make the admin side simple—so you can focus on moving in.
          </p>
        </div>
      </div>
    </div>
  );
}
