"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session, status } = useSession();
  const [hasFlat, setHasFlat] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlat = async () => {
      if (session?.user?.email) {
        const email = session.user.email.toLowerCase();
        
        const res = await fetch(`/api/flat/getFlat?email=${email}`);
        const data = await res.json();
        const userFlat = data.flat;

        if (userFlat) {
          setHasFlat(true);
        } else {
          setHasFlat(false);
        }
      }
      setLoading(false);
    };

    checkFlat();
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const username = session?.user?.name || session?.user?.email?.split("@")[0];

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
            {!hasFlat && !loading && (
              <Link href="/addflat">List your flat</Link>
            )}
            {hasFlat && !loading && (
              <span style={{ padding: "8px 16px", color: "gray", cursor: "not-allowed" }}>
                Already Listed
              </span>
            )}
          </div>
        </div>
      )}

      <div className="dropdown">
        <button className="dropbtn">{session ? `Hi ${username}!` : "Personal"} ▾</button>
        <div className="dropdown-content">
          {session ? (
            <>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/applicantsDashboard">Flat Listing</Link>
              <button onClick={handleLogout} className="dropbtn">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
