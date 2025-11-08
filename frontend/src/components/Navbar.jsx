import React from 'react'
import { Link, NavLink } from 'react-router'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/20 bg-white/70 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          Modern States
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
          
          <button
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
          >
            AI Chatbot
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar