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
        <img src="../../thumbnailpic.webp" className="flat-main-image"/>
        <h2 className="flat-details-title">Flat in Suburb</h2>
        {/* make this the main image they choose from the database or the first image? */}
        {/* <img src={flatImages[0]} alt="Main image of the flat" className="flat-main-image" /> */}
      </div>

      <div className="flat-details-box">
        {/* make this title the name of flat or the address? */}
        <p className="flat-details-text">
          You're viewing details for: <strong className="flat-id">{id}</strong>
        </p>
        <p className="flat-details-price">Price:</p>

        <div className="flat-images-grid" aria-label="Additional flat images">
          {/* {flatImages.map((src, index) => (
            <img key={index} src={src} alt={`Flat ${id} image ${index + 1}`} className="flat-thumbnail" />
          ))} */}
        </div>

        <div className="flat-info-grid">
          <section className="flat-section">
            <h3 className="flat-section-title">Flat Information</h3>
            <p className="flat-info">Location: Suburb</p>
            <p className="flat-info">Price: $200 per week</p>
            <p className="flat-info">Rooms: 3</p>
            <p className="flat-info">Furnished: Yes</p>
            <p className="flat-info">Pets allowed: No</p>
          </section>

          <section className="flat-section">
            <h3 className="flat-section-title">Flatmate Preferences</h3>
            <p className="flat-info">Looking for: Clean, tidy professional</p>
            <p className="flat-info">Move-in Date: ASAP</p>
            <p className="flat-info">Lease: Minimum 6 months</p>
          </section>
        </div>

        <section className="flat-description">
          <h3 className="flat-section-title">Description</h3>
          <p>This sunny 3-bedroom home is perfect for someone who loves peace and a good community vibe. Close to shops, buses, and parks.</p>
        </section>

        <div className="button-container">
          <button className="flat-contact-button" aria-label="Contact the flat owner">
            Contact Flat Owner
          </button>
        </div>
      </div>
    </div>
  );
}
