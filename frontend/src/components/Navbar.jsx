import React from 'react'
import { Link, NavLink } from 'react-router-dom' // ✅ correct import
import modernStatesLogo from '../assets/modern-states.png-removebg-preview.png'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-3 py-2 -ml-20">
          <img 
            src={modernStatesLogo} 
            alt="Modern States" 
            className="h-16 w-auto object-contain transition-transform duration-300 hover:scale-110 hover:rotate-3"
          />
          <span className="text-2xl font-semibold tracking-tight text-slate-900 transition-all duration-300 hover:text-blue-600">
            Modern States
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/registrar"
            className="group relative rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            <span className="relative">Institution Login</span>
          </Link>

          <Link
            to="/admin"
            className="group relative rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            <span className="relative">Admin Login</span>
          </Link>

          {/* ✅ Fixed external link */}
          <a
            href="https://modernstates.org/?form=FUNFTMPVEVX"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></span>
            <span className="relative">Support Us</span>
          </a>

          <Link
            to="/summary"
            className="group relative rounded-full bg-gradient-to-r from-[#6f7dff] to-[#f97bff] px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(111,125,255,0.35)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_15px_35px_rgba(111,125,255,0.5)] overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <span className="relative flex items-center gap-1.5">
              <svg 
                width="14" 
                height="14" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">AI Summary</span>
            </span>
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar