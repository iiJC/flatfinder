import Link from "next/link";
import "./css/globals.scss"; // Ensure this path is correct

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
            <Link href="/">🏠 FlatMate Finder</Link>
          </h1>

          {/* Search Bar */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for flats or flatmates..."
              aria-label="Search"
            />
          </div>

          {/* Add Flat Button */} 
          <nav className="nav-links">
          <Link href="/apply" className="apply-button"> Apply </Link>
          <Link href="/addflat">Add Flat</Link>
          </nav>

          {/* Navigation */}
          <nav className="nav-links">
            <Link href="/flats">Flats</Link>
            <Link href="/map">Map</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}


