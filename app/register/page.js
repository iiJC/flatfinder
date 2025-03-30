export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
        
        <form className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your username"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Password</label>
            <input 
              type="password" 
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" 
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        
        <p className="mt-4 text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}