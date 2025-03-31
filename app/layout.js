import '../css/globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'FlatMate Finder',
  description: 'Find flats, flatmates, or tenants in Dunedin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-black shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">
            <Link href="/">🏠 FlatMate Finder</Link>
          </h1>
          
          {/* Search Bar */}
          <div className="relative flex-1 mx-4">
            <input
              type="text"
              placeholder="Search for flats or flatmates..."
              className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <nav className="space-x-4">
            <Link href="/flats" className="text-white hover:underline">Flats</Link>
            <Link href="/map" className="text-white hover:underline">Map</Link>
            <Link href="/dashboard" className="text-white hover:underline">Dashboard</Link>
            <Link href="/login" className="text-white hover:underline">Login</Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}

