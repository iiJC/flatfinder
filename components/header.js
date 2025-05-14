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

  const handleListFlat = () => {
    if (session) {
      const userHasFlat = false; 

      if (userHasFlat) {
        const confirmAction = window.confirm(
          "You already have a flat listed. Would you like to delete your existing flat and list a new one?"
        );

        if (confirmAction) {

          alert("Your flat has been deleted. Now you can list a new one.");
          window.location.href = "/addflat"; 
        }
      } else {
        window.location.href = "/addflat"; 
      }
    }
  };

  return (
    <header className="header">
      <nav className="nav-links">
        <Link href="/flats" className="dropbtn">
          Flats
        </Link>
        <Link href="/map" className="dropbtn">
          Map
        </Link>
      </nav>
      <h1 className="logo">
        <Link href="/">FlatMate Finder</Link>
      </h1>


      {session && (
        <div className="dropdown">
          <button className="dropbtn">Applying ▾</button>
          <div className="dropdown-content">
            <Link href="/apply">Apply to join a Flat</Link>
            <button onClick={handleListFlat} className="dropbtn">
              List your flat
            </button>
          </div>
        </div>
      )}

      {/* Auth button */}
      <div className="dropdown">
        <button className="dropbtn">{session ? `Hi ${username}!` : "Personal"} ▾</button>
        <div className="dropdown-content">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/applicantsDashboard">Flat Listing</Link> {/* New link */}
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
    </header>
  );
}
