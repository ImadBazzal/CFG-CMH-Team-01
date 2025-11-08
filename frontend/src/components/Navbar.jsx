import React from 'react'
import { Link, NavLink } from 'react-router'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Results', to: '/results' },
  { label: 'Register', to: '/register' },
  { label: 'Admin', to: '/admin' }
]

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="text-xl font-semibold tracking-tight text-slate-900">
          CLEP School Search
        </Link>

        <ul className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-500 md:gap-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  [
                    'transition-colors',
                    isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
                  ].join(' ')
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link
          to="/register"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800"
        >
          Institution Login
        </Link>
      </nav>
    </header>
  )
}

export default Navbar
