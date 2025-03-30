// import Header from "@global/header.jsx";
export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-semibold mb-6">Your Applications</h2>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Applications</h3>
        
        <ul className="space-y-4">
          <li className="border-b pb-4">
            <p className="text-lg font-semibold">Application 1</p>
            <p className="text-sm text-gray-600">Status: Pending</p>
          </li>
          <li className="border-b pb-4">
            <p className="text-lg font-semibold">Application 2</p>
            <p className="text-sm text-gray-600">Status: Approved</p>
          </li>
          <li className="border-b pb-4">
            <p className="text-lg font-semibold">Application 3</p>
            <p className="text-sm text-gray-600">Status: Rejected</p>
          </li>
        </ul>
      </div>
    </div>
  );
}
