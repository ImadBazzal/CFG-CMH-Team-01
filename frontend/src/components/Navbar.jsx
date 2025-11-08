import React from 'react'
import { Link, NavLink } from 'react-router'
import modernStatesLogo from '../assets/modern-states.png-removebg-preview.png'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 py-2 -ml-20">
          <img 
            src={modernStatesLogo} 
            alt="Modern States" 
            className="h-16 w-auto object-contain"
          />
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            Modern States
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <Link
            to="/registrar"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Institution Login
          </Link>
          
          <Link
            to="/admin"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            Admin Login
          </Link>
          
          <Link
            to="/summary"
            className="rounded-full bg-gradient-to-r from-[#6f7dff] to-[#f97bff] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(111,125,255,0.35)] transition hover:-translate-y-0.5"
          >
            AI Summary
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar