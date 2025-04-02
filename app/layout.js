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
          <h1 className="logo">
            <Link href="/">🏠 FlatMate Finder</Link>
          </h1>

          {/* Search Bar */}
          <div className="search-bar">
            <input type="text" placeholder="Search for flats or flatmates..." />
          </div>

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

