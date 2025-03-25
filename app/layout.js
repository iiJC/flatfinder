import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'FlatMate Finder',
  description: 'Find flats, flatmates, or tenants in Dunedin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">
            <Link href="/">🏠 FlatMate Finder</Link>
          </h1>
          <nav className="space-x-4">
            <Link href="/flats" className="hover:underline">Flats</Link>
            <Link href="/flatmates" className="hover:underline">Flatmates</Link>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/landlord" className="hover:underline">Landlord</Link>
            <Link href="/login" className="hover:underline">Login</Link>
          </nav>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
