// TODO - setup MongoDB vvv
// import clientPromise from "@/lib/mongodb";
import "../../css/flatDetails.scss";
import "../../css/globals.scss"; 

export async function generateStaticParams() {
  // TODO replace with real data later
  const flatIds = ["flat1", "flat2", "flat3"];

  return flatIds.map((id) => ({
    id,
  }));
}

export default function FlatDetailsPage({ params }) {
  const { id } = params;

  return (
    <div className="flat-details-container">
      <div className="flat-details-box">
        <h2 className="flat-details-title">Flat Details</h2>
        <p className="flat-details-text">
          You're viewing details for:{" "}
          <strong className="flat-id">{id}</strong>
        </p>

        <div className="flat-section">
          <h3 className="flat-section-title">Flat Information</h3>
          <p className="flat-info">Location: TBD</p>
          <p className="flat-info">Price: TBD per week</p>
          <p className="flat-info">Rooms: TBD</p>
        </div>

        <div className="flat-section">
          <h3 className="flat-section-title">Flatmate Preferences</h3>
          <p className="flat-info">Looking for: TBD</p>
          <p className="flat-info">Move-in Date: TBD</p>
        </div>

        <button className="flat-contact-button">Contact Flat Owner</button>
      </div>
    </div>
  );
}
