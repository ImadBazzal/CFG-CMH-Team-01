import React, { useState, useMemo } from 'react'
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
  const navigate = useNavigate()

  const handleSelectChange = (event) => {
    setFilters((prev) => ({ ...prev, testType: event.target.value }))
  }

  const handleScoreChange = (event) => {
    setFilters((prev) => ({ ...prev, score: event.target.value }))
  }

  const buildQueryString = (activeFilters) => {
    const params = new URLSearchParams()

    // pass the test type as clep_exam
    if (activeFilters.testType.trim()) {
      params.append('clep_exam', activeFilters.testType.trim())
    }
    
    // pass score as min_score (is optional, will just not filter if not passed in)
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

    // Require test type
    if (!filters.testType.trim()) {
      setErrorMessage('Please select a CLEP exam type.')
      return
    }

    if (filters.score !== '' && Number(filters.score) < 0) {
      setErrorMessage('Score cannot be negative.')
      return
    }

    setErrorMessage('') // Clear any previous errors
    const queryString = buildQueryString(filters)
    console.log('Navigating with query string:', queryString)
    navigate(`/results${queryString ? `?${queryString}` : ''}`)
  }

  return (
    <>
      <section className="relative z-10 w-full max-w-3xl rounded-[32px] border border-white/10 bg-gradient-to-br from-[#070916]/90 to-[#070b20]/70 p-6 sm:p-8 lg:p-10 shadow-panel backdrop-blur-3xl">
        <form
          className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          onSubmit={handleSearch}
        >
          {/* CLEP Test Type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/80" htmlFor="testType">
              Test Type
            </label>
            <div className="relative rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-base transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
              <select
                id="testType"
                name="testType"
                value={filters.testType}
                onChange={handleSelectChange}
                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-base text-white outline-none placeholder-white/40"
              >
                <option value="" className="bg-gray-900">Select CLEP exam</option>
                {testOptions.map((option) => (
                  <option key={option} value={option} className="bg-gray-900">
                    {option}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-white/60"
              >
                ▾
              </span>
            </div>
          </div>

          {/* CLEP Test Score */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/80" htmlFor="testScore">
              Test Score
            </label>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500">
              <input
                id="testScore"
                name="testScore"
                type="number"
                min="0"
                max="80"
                step="1"
                placeholder="Enter score"
                value={filters.score}
                onChange={handleScoreChange}
                className="w-full bg-transparent text-base text-white placeholder-white/40 outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            className="rounded-full bg-gradient-to-r from-[#6f7dff] to-[#5ecfff] px-8 py-3 text-base font-semibold text-[#020308] shadow-[0_12px_25px_rgba(94,207,255,0.25)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_35px_rgba(94,207,255,0.35)] disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            Search
          </button>
        </form>

        <p className="mt-6 text-sm text-white/60">
          CLEP scores range from 20 to 80. Most schools require a minimum of 50 for credit.
        </p>

        {errorMessage && <p className="mt-4 font-semibold text-red-400">{errorMessage}</p>}
      </section>
    </>
  )
}

export default Searchbar