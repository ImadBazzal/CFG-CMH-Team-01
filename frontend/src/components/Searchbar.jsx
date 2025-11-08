import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8000/api'

const initialFilters = {
  testType: '',
  score: ''
}

const testOptions = [
  'American Government',
  'American Literature',
  'Analyzing & Interpreting Literature',
  'Biology',
  'Calculus',
  'Chemistry',
  'College Algebra',
  'College Composition',
  'College Mathematics',
  'English Literature',
  'Financial Accounting',
  'French Language',
  'German Language',
  'History of the United States I',
  'History of the United States II',
  'Human Growth and Development',
  'Information Systems',
  'Introductory Business Law',
  'Introductory Psychology',
  'Introductory Sociology',
  'Natural Sciences',
  'Precalculus',
  'Principles of Macroeconomics',
  'Principles of Microeconomics',
  'Principles of Management',
  'Principles of Marketing',
  'Spanish Language',
  'Western Civilization I',
  'Western Civilization II'
]

const Searchbar = ({ apiBaseUrl = DEFAULT_API_BASE_URL }) => {
  const [filters, setFilters] = useState(initialFilters)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectTest = (test) => {
    setFilters((prev) => ({ ...prev, testType: test }))
    setIsDropdownOpen(false)
    setSearchTerm('')
  }

  const handleScoreChange = (event) => {
    setFilters((prev) => ({ ...prev, score: event.target.value }))
  }

  const filteredOptions = testOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const buildQueryString = (activeFilters) => {
    const params = new URLSearchParams()

    if (activeFilters.testType.trim()) {
      params.append('clep_exam', activeFilters.testType.trim())
    }
    
    if (activeFilters.score !== '') {
      const parsedScore = Number(activeFilters.score)
      if (!Number.isNaN(parsedScore) && parsedScore >= 0) {
        params.append('min_score', parsedScore)
      }
    }

    const queryString = params.toString()
    console.log('Built query string:', queryString)
    return queryString
  }

  const handleSearch = (event) => {
    event?.preventDefault()

    if (!filters.testType.trim()) {
      setErrorMessage('Please select a CLEP exam type.')
      return
    }

    if (filters.score !== '' && Number(filters.score) < 0) {
      setErrorMessage('Score cannot be negative.')
      return
    }

    setErrorMessage('')
    const queryString = buildQueryString(filters)
    console.log('Navigating with query string:', queryString)
    navigate(`/results${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <>
      <section className="relative z-10 w-full max-w-3xl mx-auto rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-8 lg:p-10 shadow-panel backdrop-blur-3xl">
        <form
          className="flex flex-col items-center gap-5"
          onSubmit={handleSearch}
        >
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CLEP Test Type - Custom Dropdown */}
            <div className="flex flex-col gap-3" ref={dropdownRef}>
              <label className="text-sm font-medium text-white/80" htmlFor="testType">
                Test Type
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-left text-base transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/10 hover:bg-white/8 outline-none"
                >
                  <span className={`font-medium ${filters.testType ? 'text-white' : 'text-white/40'}`}>
                    {filters.testType || 'Select CLEP exam'}
                  </span>
                  <span
                    className={`absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-50 mt-2 w-full rounded-xl border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-white/10">
                      <div className="relative">
                        <svg 
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none"
                        >
                          <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2"/>
                          <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        <input
                          type="text"
                          placeholder="Search exams..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 rounded-lg border border-white/10 bg-white/5 text-white text-sm placeholder-white/40 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
                        />
                      </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleSelectTest(option)}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors duration-150 ${
                              filters.testType === option
                                ? 'bg-blue-500/20 text-blue-300 font-medium'
                                : 'text-white/80 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            {option}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-white/40 text-sm">
                          No exams found
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* CLEP Test Score - numeric input */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-white/80" htmlFor="testScore">
                Test Score
              </label>
              <div className="relative">
                <input
                  id="testScore"
                  name="testScore"
                  type="number"
                  min="20"
                  max="80"
                  placeholder="Enter a score between 20-80"
                  value={filters.score}
                  onChange={handleScoreChange}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base font-medium text-white placeholder-white/40 transition-all duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 focus:bg-white/10 hover:bg-white/8 outline-none"
                />
                <p className="mt-2 text-xs text-white/50">
                  Leave blank to see all accepted scores.
                </p>
              </div>
            </div>
          </div>

          {/* Search Button - Centered with Animations */}
          <button
            className="group relative rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-12 py-3.5 text-base font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_40px_rgba(94,207,255,0.4)] active:translate-y-0 active:scale-100 disabled:translate-y-0 disabled:scale-100 disabled:cursor-not-allowed disabled:opacity-70 overflow-hidden"
            type="submit"
          >
            {/* Shine effect on hover */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            
            <span className="relative flex items-center gap-2">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none"
                className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
              >
                <path d="M15.5 15.5L21 21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2.5"/>
              </svg>
              <span className="transition-all duration-300 group-hover:tracking-wide">Search</span>
            </span>
          </button>
        </form>

        <p className="mt-6 text-sm text-white/60 text-center">
          CLEP scores range from 20 to 80. Most schools require a minimum of 50 for credit.
        </p>

        {errorMessage && (
          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center">
            <p className="font-semibold text-red-400">{errorMessage}</p>
          </div>
        )}
      </section>

      <style jsx>{`
        /* Custom scrollbar for dropdown */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(94, 207, 255, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(94, 207, 255, 0.5);
        }

        /* Hide number input arrows (legacy fallback) */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>
    </>
  )
}

export default Searchbar