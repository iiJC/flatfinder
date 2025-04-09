import "./css/globals.scss";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="home-page">
      <h2 className="title">Welcome to FlatMate Finder, Are you...</h2>

      {/* Link these to the correct pages */}
      <div className="buttons-container">
        <div className="card looking-flat">
          <img className="flat-image" src="./LookingForFlat.png" alt="Flatmate" />
          <div className="overlay">
            <Link href="/flats" className="button button-flat">
              Looking for a flat!
            </Link>
          </div>
        </div>

        <div className="card looking-flatmate">
          <img className="flatmate-image" src="./LookingForFlatmate.png" alt="Flat" />
          <div className="overlay">
            <Link href="/addflat" className="button button-flat">
              Looking for a flatmate!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
