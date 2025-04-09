import "../css/flats.scss";
import "../css/globals.scss";

export default function FlatsPage() {
  const flats = [
    {
      id: "flat1",
      location: "Downtown",
      price: "$250/week",
      rooms: 2,
      image: "./thumbnailpic.webp",
    },
    {
      id: "flat2",
      location: "Suburb",
      price: "$200/week",
      rooms: 3,
      image: "./thumbnailpic.webp",
    },
    {
      id: "flat3",
      location: "City Center",
      price: "$300/week",
      rooms: 1,
      image: "./thumbnailpic.webp",
    },
  ];

  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="flats-title">Browse Available Flats</h2>

{/* Create an if to display the flat name if there is one */}
        <ul className="flats-list">
          {flats.map((flat) => (
            <li key={flat.id} className="flat-item">
              <img src={flat.image} alt={`Flat in ${flat.location}`} className="flat-image" />
              <div className="flat-details">
                <h3 className="flat-id">Flat ID: {flat.id}</h3>
                <p className="flat-info">Location: {flat.location}</p>
                <p className="flat-info">Price: {flat.price}</p>
                <p className="flat-info">Rooms: {flat.rooms}</p>
                <a href={`/flats/${flat.id}`} className="flat-details-link">
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


