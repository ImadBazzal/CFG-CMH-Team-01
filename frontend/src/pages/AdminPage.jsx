import React, { useState } from 'react'

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#030712,#020310_55%,#050917)]">
      <header className="border-b border-white/10 bg-black/20">
        <div className="px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
            <p className="text-sm text-white/60">CLEP Data Management</p>
          </div>
          <button
            className="px-4 py-2 text-sm text-white/80 hover:text-white border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            onClick={() => setIsLoggedIn(false)}
          >
            Sign Out
          </button>
        </div>
      </header>
      
      <main className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for future management sections */}
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-2">Institution Management</h2>
            <p className="text-sm text-white/70">Manage CLEP-accepting institutions and their policies.</p>
          </div>
          
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-2">Data Analytics</h2>
            <p className="text-sm text-white/70">View acceptance rates and policy trends.</p>
          </div>
          
          <div className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-lg font-medium text-white mb-2">User Management</h2>
            <p className="text-sm text-white/70">Manage administrator and institution access.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

const AdminPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Add actual authentication logic here
    if (credentials.username && credentials.password) {
      setIsLoggedIn(true)
    }
  }

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isLoggedIn) {
    return <AdminDashboard />
  }

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)] px-4 py-10 sm:px-6 lg:px-12">
      <div
        className="pointer-events-none absolute -right-[10%] -top-[25%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(80,120,255,0.3),transparent_60%)] blur-[8px]"
        aria-hidden="true"
      />
      <section className="relative z-10 w-full max-w-xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-10 lg:p-14 shadow-panel backdrop-blur-3xl">
        <header className="flex flex-col items-center text-center mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
            Administrator Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-[2.4rem]">
            Admin Console
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/70">
            Secure access for CLEP acceptance policy management.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white/80 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-white/60 hover:text-white/80 transition-colors"
          >
          </a>
        </div>
      </section>
    </main>
  )
}

export default AdminPage
