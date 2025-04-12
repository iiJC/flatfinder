"use client";

import "./css/globals.scss";
import Link from "next/link";

// TODO remove this once images are back
// Temporary home page with buttons
export default function HomePage() {
  return (
    <div className="home-page">
      <h2 className="title">Welcome to FlatMate Finder, Are you...</h2>

      <div className="buttons-container">
        <Link href="/flats" className="role-button flat">
          Looking for a flat!
        </Link>
        <Link href="/addflat" className="role-button flatmate">
          Looking for a flatmate!
        </Link>
      </div>
    </div>
  );
}

// TODO images are on icloud, upload and save them to the repo...
// export default function HomePage() {
//   return (
//     <div className="home-page">
//       <h2 className="title">Welcome to FlatMate Finder, Are you...</h2>

//       {/* Link these to the correct pages */}
//       <div className="buttons-container">
//         <div className="card looking-flat">
//           <img
//             className="flat-image"
//             src="./LookingForFlat.png"
//             alt="Flatmate"
//           />
//           <div className="overlay">
//             <Link href="/flats" className="button button-flat">
//               Looking for a flat!
//             </Link>
//           </div>
//         </div>

//         <div className="card looking-flatmate">
//           <img
//             className="flatmate-image"
//             src="./LookingForFlatmate.png"
//             alt="Flat"
//           />
//           <div className="overlay">
//             <Link href="/addflat" className="role-button flatmate">
//               Looking for a flatmate!
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
