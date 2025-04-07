// RootLayout.jsx
import Link from "next/link";
import "./css/globals.scss";

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
            <input type="text" placeholder="Search for flats or flatmates..." aria-label="Search" />
          </div>

          {/* Dropdown Menus */}

          <nav className="nav-links">
            <Link href="/flats">Flats</Link>
            <Link href="/map">Map</Link>
          </nav>

          <div className="dropdown-container">
            <div className="dropdown">
              <button className="dropbtn">Applying ▾</button>
              <div className="dropdown-content">
                <Link href="/apply">Apply</Link>
                <Link href="/addflat">Add Flat</Link>
              </div>
            </div>
            <div className="dropdown">
              <button className="dropbtn">Personal ▾</button>
              <div className="dropdown-content">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/login">Login</Link>
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
