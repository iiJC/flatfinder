export default function FlatsPage() {
  // TODO: Replace with real data later
  const flats = [
    { id: 'flat1', location: 'Downtown', price: '$250/week', rooms: 2 },
    { id: 'flat2', location: 'Suburb', price: '$200/week', rooms: 3 },
    { id: 'flat3', location: 'City Center', price: '$300/week', rooms: 1 },
  ];

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-6 text-center">Browse Available Flats</h2>

        <ul className="space-y-4">
          {flats.map((flat) => (
            <li key={flat.id} className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-xl font-semibold">Flat ID: {flat.id}</h3>
              <p className="text-gray-700">Location: {flat.location}</p>
              <p className="text-gray-700">Price: {flat.price}</p>
              <p className="text-gray-700">Rooms: {flat.rooms}</p>
              <a
                href={`/flats/${flat.id}`}
                className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Details
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
