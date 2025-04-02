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
<<<<<<< HEAD
          
          <nav className="space-x-4">
            <Link href="/flats" className="text-white hover:underline">Flats</Link>
            <Link href="/map" className="text-white hover:underline">Map</Link>
            <Link href="/dashboard" className="text-white hover:underline">Dashboard</Link>
            <Link href="/login" className="text-white hover:underline">Login</Link>
            <Link href="/addflat" className="text-white hover:underline">add flat</Link>
          
=======

          <nav className="nav-links">
            <Link href="/flats">Flats</Link>
            <Link href="/map">Map</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/login">Login</Link>
>>>>>>> b2ebd7fbc9fc1da58ed4526a5fe20c74a33fd557
          </nav>
        </header>

        {/* Main Content */}
        <main className="main-content">{children}</main>
      </body>
    </html>
  );
}

