// RootLayout.jsx
import Link from "next/link";
import "./css/globals.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export const metadata = {
  title: "FlatMate Finder",
  description: "Find flats, flatmates, or tenants in Dunedin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="root-layout">
        <header className="header">
          {/* Logo */}
          <h1 className="logo">
            <Link href="/">FlatMate Finder</Link>
          </h1>

          {/* Search Bar */}
          <div className="search-bar">
            <input type="text" placeholder="Search for flats or flatmates..." aria-label="Search"/>
            <FontAwesomeIcon icon={faSearch} className="search-icon" /> 
            {/* onClick={() => search()} */}
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
            <div className="dropdown">
              <button className="dropbtn">Applying ▾</button>
              <div className="dropdown-content">
                <Link href="/apply">Apply to join a Flat</Link>
                <Link href="/addflat">List your flat</Link>
              </div>
            </div>

            {/* add a place to show when someone is logged in */}
            <div className="dropdown">
              <button className="dropbtn">Personal ▾</button>
              <div className="dropdown-content">
                <Link href="/login">Login</Link>
                <Link href="/dashboard">Dashboard</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}
