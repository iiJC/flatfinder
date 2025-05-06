"use client";

import React from "react";
import "./css/globals.scss";
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
            <Link href="/addflat" className="role-button flatmate">
              Find a flatmate!
            </Link>
          </div>
        </div>
        </div>
      </div>

      <div className="details">
        <div className="info students">Perfect for students (inclusive)</div>
        <div className="info pos-flats">Some Possible Flats</div>
        <div className="info check-map">Check the Map</div>
        <div className="info customer">Satisfied Customers</div>
        <div className="info admin">Admin Made easy</div>
      </div>
    </div>
  );
}
