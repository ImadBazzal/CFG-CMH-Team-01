import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const DEFAULT_API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8000/api'

const initialFilters = {
  testType: '',
  score: ''
}

const testOptions = [
  'Algebra',
  'Humanities',
  'American Government',
  'Biology',
  'Chemistry',
  'College Composition',
  'History of the United States',
  'Principles of Management',
  'Spanish',
  'Other'
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

  // passs the test type as clep_exam
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
      <section className="space-y-6 rounded-3xl bg-white p-8 shadow-md">
        <form
          className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          onSubmit={handleSearch}
        >
          {/* CLEP Test Type */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-600" htmlFor="testType">
              Test Type
            </label>
            <div className="relative rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-base transition focus-within:border-indigo-300 focus-within:shadow-md">
              <select
                id="testType"
                name="testType"
                value={filters.testType}
                onChange={handleSelectChange}
                className="w-full cursor-pointer appearance-none bg-transparent pr-6 text-base font-medium text-gray-800 outline-none"
              >
                <option value="">Select CLEP exam</option>
                {testOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-base text-gray-500"
              >
                ▾
              </span>
            </div>
          </div>

          {/* CLEP Test Score */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-600" htmlFor="testScore">
              Test Score
            </label>
            <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 transition focus-within:border-indigo-300 focus-within:shadow-md">
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
                className="w-full bg-transparent text-base font-medium text-gray-800 placeholder:text-gray-400 outline-none"
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
          >
            <span className="text-lg" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15.5 15.5L21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Search
          </button>
        </form>

        <p className="text-base text-gray-500">
          CLEP scores range from 20 to 80. Most schools require a minimum of 50 for credit.
        </p>

        {errorMessage && <p className="mt-4 font-semibold text-red-600">{errorMessage}</p>}
      </section>
    </>
  )
}

export default Searchbar