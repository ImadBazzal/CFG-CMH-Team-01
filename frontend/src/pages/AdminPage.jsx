import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    loading: true,
    error: null,
    data: null
  })

  useEffect(() => {
    fetchDatabaseStats()
  }, [])

  const fetchDatabaseStats = async () => {
    try {
      // Hardcoded statistics for development/testing. These mirror the shape
      // produced by analyzeData() and the backend responses.
      const statsData = {
        totalInstitutions: 40,
        policiesReported: 251,
        clepAcceptance: {
          humanities: 35,
          americanGov: 30,
          mathematics: 31,
          composition: 36,
          biology: 30,
          calculus: 28
        },
        stateBreakdown: {
          CA: 20,
          NY: 15,
          TX: 12,
          FL: 10,
          PA: 8,
          OH: 7,
          IL: 6,
          GA: 5,
          NC: 4,
          MI: 3
        },
        backend: {
          health: { status: 'mock', database: 'mocked' },
          returnedCount: 40
        }
      }

      setStats({ loading: false, error: null, data: statsData })
    } catch (err) {
      setStats({ loading: false, error: `Failed to load hardcoded stats: ${err.message}`, data: null })
    }
  }

  const analyzeData = (schools) => {
    const stats = {
      totalInstitutions: schools.length,
      policiesReported: 0,
      stateBreakdown: {},
      clepAcceptance: {
        humanities: 0,
        americanGov: 0,
        mathematics: 0,
        composition: 0
      },
      completeRecords: 0
    }

    schools.forEach(school => {
      // Count state distribution
      if (school.State) {
        stats.stateBreakdown[school.State] = (stats.stateBreakdown[school.State] || 0) + 1
      }

      // Count CLEP acceptance by subject
      if (school.Humanities) stats.clepAcceptance.humanities++
      if (school['American Government']) stats.clepAcceptance.americanGov++
      if (school.Mathematics) stats.clepAcceptance.mathematics++
      if (school.Composition) stats.clepAcceptance.composition++

      // Count complete records (schools with all major fields filled)
      if (school.Humanities && school['American Government'] && 
          school.Mathematics && school.Composition) {
        stats.completeRecords++
      }

      // Count total policies reported
      const hasAnyPolicy = school.Humanities || school['American Government'] || 
                          school.Mathematics || school.Composition
      if (hasAnyPolicy) {
        stats.policiesReported++
      }
    })

    return stats
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#030712,#020310_55%,#050917)] text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <p className="text-white/60 mt-1">Database Statistics Overview</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm border border-white/10 rounded-lg hover:bg-white/5"
          >
            Sign Out
          </button>
        </div>

        {stats.loading ? (
          <div className="text-center py-8">Loading database statistics...</div>
        ) : stats.error ? (
          <div className="text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-4 text-center">
            {stats.error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
            Statistics Section
              <h2 className="text-lg font-semibold mb-4">Database Overview</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Institutions:</span>
                  <span className="font-semibold text-blue-400">{stats.data.totalInstitutions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Policies Reported:</span>
                  <span className="font-semibold text-blue-400">{stats.data.policiesReported}</span>
                </div>
                {/* Complete records removed from view per request */}
              </div>
            </div>

            {/* CLEP Acceptance by Subject */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">CLEP Acceptance by Subject</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Humanities:</span>
                  <span className="font-semibold text-blue-400">{stats.data.clepAcceptance.humanities} schools</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">American Government:</span>
                  <span className="font-semibold text-blue-400">{stats.data.clepAcceptance.americanGov} schools</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Mathematics:</span>
                  <span className="font-semibold text-blue-400">{stats.data.clepAcceptance.mathematics} schools</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Composition:</span>
                  <span className="font-semibold text-blue-400">{stats.data.clepAcceptance.composition} schools</span>
                </div>
              </div>
            </div>

            {/* Geographic Distribution */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Top States by Institution Count</h2>
              <div className="space-y-3 max-h-[200px] overflow-y-auto hide-scrollbar">
                {Object.entries(stats.data.stateBreakdown)
                  .sort(([,a], [,b]) => b - a)
                  .slice(0, 10)
                  .map(([state, count]) => (
                    <div key={state} className="flex justify-between items-center">
                      <span className="text-white/70">{state}:</span>
                      <span className="font-semibold text-blue-400">{count} institutions</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const AdminPage = () => {
  const navigate = useNavigate()
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Hardcoded admin credentials
  const VALID_CREDENTIALS = {
    username: 'admin',
    password: 'pass'
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setLoginError('')
    navigate('/')  // Navigate to home page
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoginError('')  // Clear any previous error

    // Check against creds 
    if (credentials.username === VALID_CREDENTIALS.username && 
        credentials.password === VALID_CREDENTIALS.password) {
      setIsLoggedIn(true)
    } else {
      setLoginError('Invalid username or password')
    }
  }

  const handleChange = (e) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleSignOut} />
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

          {loginError && (
            <div className="text-red-400 text-sm text-center mb-4">
              {loginError}
            </div>
          )}
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-6 py-3 text-sm font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)]"
            >
              Sign In
            </button>
          </div>
        </form>

        {loginError && (
          <div className="mt-4 text-center">
            <p className="text-sm text-white/60">
            </p>
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminPage
