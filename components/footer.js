"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        <div className="section">Terms and Conditions</div>
        <div className="section">About Us</div>
        <div className="section">How It Works</div>
        <div className="section">Frequently Asked Questions</div>

      </div>
    </footer>
  );
}
