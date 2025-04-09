import "../../css/flatDetails.scss";
import "../../css/globals.scss";

export async function generateStaticParams() {
  // Replace this with real data later
  const flatIds = ['flat1', 'flat2', 'flat3']; // Example IDs

  return flatIds.map((id) => ({
    id,
  }));
}


export default function FlatDetailsPage({ params }) {
  const { id } = params;

  // Temp: mock image and info
  const flatImages = ["/images/flat1.jpg", "/images/flat2.jpg", "/images/flat3.jpg"];

  return (
    <div className="flat-details-container">
  <div className="flat-hero">
    <img src="../../thumbnailpic.webp" alt="Main flat view" className="flat-main-image" />
    <div className="flat-hero-overlay">
      <h1 className="flat-hero-title">Mt Wellington Townhouse – Females Only</h1>
      <p className="flat-hero-subtitle">3-bedroom home · Mt Wellington, Auckland</p>
    </div>
  </div>

  <div className="flat-content">
    <div className="flat-main-column">
      <section className="flat-section">
        <h2>About this place</h2>
        <p>This tidy, sunny townhouse is available now. It has a fully equipped kitchen, cozy shared lounge, and a small backyard.</p>
      </section>

      <section className="flat-section">
        <h2>Flatmate Preferences</h2>
        <ul>
          <li>Looking for: Female, professional or student</li>
          <li>Move-in date: ASAP</li>
          <li>Lease: 6-month minimum</li>
        </ul>
      </section>

      <section className="flat-section">
        <h2>Features</h2>
        <ul className="flat-tags">
          <li>Furnished</li>
          <li>Wi-Fi</li>
          <li>Off-street parking</li>
          <li>No pets</li>
        </ul>
      </section>
    </div>

    <aside className="flat-sidebar">
      <div className="flat-price-box">
        <p className="flat-price">$200/week</p>
        <p className="flat-bills">Bills not included</p>
      </div>
      <button className="flat-contact-button">Contact Flat Owner</button>
    </aside>
  </div>
</div>
  );
}
