// TODO - setup mongodb vvv 
// import clientPromise from "@/lib/mongodb";
// import styles from css class ;

export async function generateStaticParams() {
  // TODO replace with real data later
  const flatIds = ['flat1', 'flat2', 'flat3'];

  return flatIds.map((id) => ({
    id,
  }));
}

export default function FlatDetailsPage({ params }) {
  const { id } = params;

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-4 text-center">Flat Details</h2>
        <p className="text-lg text-gray-700 text-center">
          You're viewing details for: <strong className="text-blue-600">{id}</strong>
        </p>

        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Flat Information</h3>
          <p className="text-gray-600">Location: TBD</p>
          <p className="text-gray-600">Price: TBD per week</p>
          <p className="text-gray-600">Rooms: TBD</p>
        </div>

        <div className="mt-4 border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Flatmate Preferences</h3>
          <p className="text-gray-600">Looking for: TBD</p>
          <p className="text-gray-600">Move-in Date: TBD</p>
        </div>

        <button className="mt-6 w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700">
          Contact Flat Owner
        </button>
      </div>
    </div>
  );
}
