import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Modern States logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-black">Modern States</h1>
          </div>
            <div> 
            <Link
              to="/admin"
              className="btn btn-primary px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Admin Login
            </Link>
            <Link
              to="/register"
              className="btn btn-primary px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
            >
              Institution Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar