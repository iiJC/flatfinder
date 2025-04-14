"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const username = session?.user?.name || session?.user?.email?.split("@")[0]; // fallback if name is missing

  return (
    <header className="header">
      {/* Logo */}
      <h1 className="logo">
        <Link href="/">FlatMate Finder</Link>
      </h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for flats or flatmates..."
          aria-label="Search"
        />
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
      </div>

      {/* Dropdown Menus */}
      <div className="dropdown-container">
        <nav className="nav-links">
          <Link href="/flats" className="dropbtn">
            Flats
          </Link>
          <Link href="/map" className="dropbtn">
            Map
          </Link>
        </nav>

        {/* Apply dropdown only if logged in */}
        {session && (
          <div className="dropdown">
            <button className="dropbtn">Applying ▾</button>
            <div className="dropdown-content">
              <Link href="/apply">Apply to join a Flat</Link>
              <Link href="/addflat">List your flat</Link>
            </div>
          </div>
        )}

        {/* Auth button */}
        <div className="dropdown">
          <button className="dropbtn">
            {session ? `Hi ${username}!` : "Personal"} ▾
          </button>
          <div className="dropdown-content">
            {session ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <button onClick={handleLogout} className="dropbtn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
