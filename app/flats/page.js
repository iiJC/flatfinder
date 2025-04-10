import clientPromise from "@/db/database"; // update path as needed
import "../css/flats.scss";
import "../css/globals.scss";

export default async function FlatsPage() {
  const client = await clientPromise;
  const db = client.db("flatfinderdb");
  const collection = db.collection("flats");

  const flats = await collection.find({}).toArray();

  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="title">Browse Available Flats</h2>

        <ul className="flats-list">
          {flats.map((flat) => (
            <li key={flat._id.toString()} className="flat-item">
              <img
                src={flat.images || "/thumbnailpic.webp"}
                alt={`Flat in ${flat.location}`}
                className="flat-image"
              />
              <div className="flat-details">
                <h3 className="flat-id">
                  Flat ID: {flat._id.toString().slice(-5)}
                </h3>
                <p className="flat-info">Location: {flat.location}</p>
                <p className="flat-info">Price: ${flat.rent_per_week}/week</p>
                <p className="flat-info">Rooms: {flat.rooms}</p>
                <a href={`/flats/${flat._id}`} className="flat-details-link">
                  View Details
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
