"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();
  const [hasFlat, setHasFlat] = useState(false);
  const [flatId, setFlatId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkFlat = async () => {
      if (!session?.user?.email) return;
      const email = session.user.email.toLowerCase();

      try {
        const res = await fetch("/api/flat/getFlat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        console.log("Flat info API result:", data);

        if (data.flat) {
          setHasFlat(true);
          setFlatId(data.flat._id); // Adjust this based on your schema
        } else {
          setHasFlat(false);
          setFlatId(null);
        }
      } catch (err) {
        console.error("Error fetching flat info:", err);
        setHasFlat(false);
        setFlatId(null);
      }

      setLoading(false);
    };

    checkFlat();
  }, [session]);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  const username = session?.user?.name || session?.user?.email?.split("@")[0];

  const handleListFlatClick = async () => {
    if (hasFlat && flatId) {
      const confirmDelete = window.confirm(
        "You have already listed a flat, would you like to delete the current one or cancel?"
      );
      if (confirmDelete) {
        try {
          const res = await fetch(`/api/deleteFlat/${flatId}`, {
            method: "DELETE",
          });
          if (res.ok) {
            alert("Flat deleted successfully.");
            setHasFlat(false);
            setFlatId(null);
          } else {
            alert("Failed to delete flat.");
          }
        } catch (err) {
          console.error("Error deleting flat:", err);
          alert("Error deleting flat.");
        }
      }
    } else {
      window.location.href = "/addflat";
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

      {session && !loading && (
        <div className="dropdown">
          <button className="dropbtn">Applying ▾</button>
          <div className="dropdown-content">
            <Link href="/apply">Apply to join a Flat</Link>
            <button onClick={handleListFlatClick} className="dropbtn">
              List your flat
            </button>
          </div>
        </div>
      )}

      <div className="dropdown">
        <button className="dropbtn">
          {session ? `Hi ${username}!` : "Personal"} ▾
        </button>
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
