export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white p-6">
      <h2 className="text-3xl font-semibold mb-6 text-center">Welcome to FlatMate Finder</h2>

      <p className="text-lg mb-8 text-center">
        Find the perfect place to call home or connect with a flatmate today!
      </p>

      <div className="flex space-x-4">
        <button
          className="bg-white text-blue-500 py-3 px-6 rounded-lg shadow-lg text-xl font-semibold hover:bg-blue-100 transition-all duration-300"
          // onClick={() => window.location.href = "/search-flats"}
        >
          Looking for a Flat
        </button>

        <button
          className="bg-white text-teal-500 py-3 px-6 rounded-lg shadow-lg text-xl font-semibold hover:bg-teal-100 transition-all duration-300"
          // onClick={() => window.location.href = "/search-flatmates"}
  
        >
          Looking for a Flatmate
        </button>
      </div>
    </div>
  );
}
