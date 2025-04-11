import clientPromise from "@/db/database";
import { ObjectId } from "mongodb";
import "../../../css/flatDetails.scss";
import "../../../css/globals.scss";

export default async function FlatDetailsPage({ params }) {
  const { id } = params;

  // Validate ObjectId
  if (!ObjectId.isValid(id)) {
    return (
      <div className="p-6 text-red-500 text-center">Invalid Flat ID: {id}</div>
    );
  }

  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const flat = await db.collection("flats").findOne({ _id: new ObjectId(id) });

  if (!flat) {
    return <div className="p-6 text-red-500 text-center">Flat not found.</div>;
  }

  return (
    <div className="flat-details-container">
      <div className="flat-hero">
        <img
          src={flat.images || "/thumbnailpic.webp"}
          alt={flat.address}
          className="flat-main-image"
        />
        <div className="flat-hero-overlay">
          <h1 className="flat-hero-title">
            {flat.description || "Flat Listing"}
          </h1>
          <p className="flat-hero-subtitle">{flat.address}</p>
        </div>
      </div>

      <div className="flat-content">
        <div className="flat-main-column">
          <section className="flat-section">
            <h2>About this place</h2>
            <p>{flat.features || "No description provided."}</p>
          </section>
          {flat.tags?.length > 0 && (
            <section className="flat-section">
              <h2>Tags</h2>
              <ul className="flat-tags">
                {flat.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="flat-sidebar">
          <div className="flat-price-box">
            <p className="flat-price">${flat.rent_per_week}/week</p>
            <p className="flat-bills">
              {flat.utilities_included || "Bills info not provided"}
            </p>
          </div>
          <button className="flat-contact-button">Contact Flat Owner</button>
        </aside>
      </div>
    </div>
  );
}
