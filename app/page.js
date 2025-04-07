import "./css/globals.scss";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-page">
      <h2 className="title">Welcome to FlatMate Finder</h2>

      <p className="description">
        Find the perfect place to call home or connect with a flatmate today!
      </p>

      {/* Link these to the correct pages */}
      <div className="buttons-container"> 
        <button className="button button-flat">
        <Link href="/flats">Looking for a flat</Link>
        </button>

        <button className="button button-flatmate">
          Looking for a Flatmate
        </button>
      </div>
    </div>
  );
}

