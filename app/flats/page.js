import "../css/flats.scss";
import "../css/globals.scss"; 

export default function FlatsPage() {
  // TODO: Replace with real data later
  const flats = [
    { id: "flat1", location: "Downtown", price: "$250/week", rooms: 2 },
    { id: "flat2", location: "Suburb", price: "$200/week", rooms: 3 },
    { id: "flat3", location: "City Center", price: "$300/week", rooms: 1 },
  ];

  return (
    <div className="flats-container">
      <div className="flats-box">
        <h2 className="flats-title">Browse Available Flats</h2>

        <ul className="flats-list">
          {flats.map((flat) => (
            <li key={flat.id} className="flat-item">
              <h3 className="flat-id">Flat ID: {flat.id}</h3>
              <p className="flat-info">Location: {flat.location}</p>
              <p className="flat-info">Price: {flat.price}</p>
              <p className="flat-info">Rooms: {flat.rooms}</p>
              <a href={`/flats/${flat.id}`} className="flat-details-link">
                View Details
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

