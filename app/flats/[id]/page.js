export const dynamic = "force-static"; // required for static export (GitHub Pages)

const mockFlats = [
  {
    _id: "flat1",
    address: "123 Castle Street",
    location: "North Dunedin",
    rent_per_week: 220,
    rooms: 3,
    tags: ["Party", "Furnished"],
    images: "/thumbnailpic.webp",
    features: "Sunny and spacious flat with great vibes.",
    description: "Legendary Castle Street Flat!",
    utilities_included: "Power + Internet included"
  },
  {
    _id: "flat2",
    address: "456 Leith Street",
    location: "Central Dunedin",
    rent_per_week: 250,
    rooms: 4,
    tags: ["Quiet", "Fibre internet"],
    images: "/thumbnailpic.webp",
    features: "Peaceful street with big kitchen and nice lounge.",
    description: "Perfect for postgrads!",
    utilities_included: "Power included"
  }
];

export async function generateStaticParams() {
  return mockFlats.map((flat) => ({
    id: flat._id
  }));
}

export default function FlatDetailsPage({ params }) {
  const { id } = params;
  const flat = mockFlats.find((f) => f._id === id);

  if (!flat) {
    return (
      <div className="p-8 text-center text-red-500">
        Flat with ID "{id}" not found.
      </div>
    );
  }

  return (
    <div className="flat-details-container">
      <div className="flat-hero">
        <img
          src={flat.images || "/thumbnailpic.webp"}
          alt={`Flat at ${flat.address}`}
          className="flat-main-image"
        />
        <div className="flat-hero-overlay">
          <h1 className="flat-hero-title">{flat.description}</h1>
          <p className="flat-hero-subtitle">{flat.address}</p>
        </div>
      </div>

      <div className="flat-content">
        <div className="flat-main-column">
          <section className="flat-section">
            <h2>About this place</h2>
            <p>{flat.features}</p>
          </section>

          {flat.tags?.length > 0 && (
            <section className="flat-section">
              <h2>Features</h2>
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
