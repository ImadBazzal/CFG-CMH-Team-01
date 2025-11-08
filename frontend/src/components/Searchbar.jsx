import React, { useMemo, useState } from 'react'

const DEFAULT_API_BASE_URL =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://localhost:8000'

const initialFilters = {
  testType: '',
  score: ''
}

const testOptions = [
  'Algebra',
  'Biology',
  'Chemistry',
  'College Composition',
  'History of the United States',
  'Principles of Management',
  'Spanish',
  'Other'
]

const Searchbar = ({ apiBaseUrl = DEFAULT_API_BASE_URL, onResults, onError }) => {
  const [filters, setFilters] = useState(initialFilters)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastQuery, setLastQuery] = useState(null)

  const normalizedBaseUrl = useMemo(
    () => (apiBaseUrl ? apiBaseUrl.replace(/\/$/, '') : DEFAULT_API_BASE_URL),
    [apiBaseUrl]
  )

  const lastQueryDescription = useMemo(() => {
    if (!lastQuery) return ''
    try {
      const url = new URL(lastQuery.endpoint)
      return url.search || 'all tests'
    } catch {
      return 'your filters'
    }
  }, [lastQuery])

  const handleSelectChange = (event) => {
    setFilters((prev) => ({ ...prev, testType: event.target.value }))
  }

  const handleScoreChange = (event) => {
    setFilters((prev) => ({ ...prev, score: event.target.value }))
  }

  const buildQueryString = (activeFilters) => {
    const params = new URLSearchParams()

    if (activeFilters.testType.trim()) params.append('test_name', activeFilters.testType.trim())

    if (activeFilters.score !== '') {
      const parsedScore = Number(activeFilters.score)
      if (!Number.isNaN(parsedScore)) {
        params.append('min_score', parsedScore)
        params.append('max_score', parsedScore)
      }
    }

    return params.toString()
  }

  const handleSearch = async (event) => {
    event?.preventDefault()

    if (filters.score !== '' && Number(filters.score) < 0) {
      setErrorMessage('Score cannot be negative.')
      return
    }

    const queryString = buildQueryString(filters)
    const endpoint = `${normalizedBaseUrl}/tests/search${queryString ? `?${queryString}` : ''}`

    setLoading(true)
    setErrorMessage('')

    try {
      const response = await fetch(endpoint)
      if (!response.ok) throw new Error('Unable to fetch test data. Please try again.')

      const payload = await response.json()
      const payloadData = payload?.data ?? []
      setResults(payloadData)
      setLastQuery({ endpoint, count: payload?.count ?? payloadData.length })
      onResults?.(payload)
    } catch (error) {
      setErrorMessage(error.message ?? 'Something went wrong while searching.')
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="space-y-6 rounded-3xl bg-white p-8 shadow-md">
        <form
          className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
          onSubmit={handleSearch}
        >
          {/* Test Type */}
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

          {/* Test Score */}
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
            disabled={loading}
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
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        <p className="text-base text-gray-500">
          CLEP scores range from 20 to 80. Most schools require a minimum of 50 for credit.
        </p>
      </section>

      {errorMessage && <p className="mt-4 font-semibold text-red-600">{errorMessage}</p>}

      {!errorMessage && lastQuery && (
        <p className="mt-6 text-base text-gray-500">
          Showing {results.length} result{results.length === 1 ? '' : 's'} for {lastQueryDescription}.
        </p>
      )}

      {!loading && !errorMessage && results.length > 0 && (
        <div className="mt-4 space-y-3 rounded-3xl bg-white p-6 shadow-md">
          <div className="grid grid-cols-2 gap-3 text-sm font-semibold text-gray-500 sm:grid-cols-4 sm:text-base">
            <span>Test</span>
            <span>Score</span>
            <span>Location</span>
            <span>School</span>
          </div>
          {results.map((result) => (
            <div
              key={result.id ?? `${result.test_name}-${result.school}-${result.location}`}
              className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3 text-sm text-gray-800 sm:grid-cols-4 sm:text-base"
            >
              <span>{result.test_name ?? 'N/A'}</span>
              <span>{result.test_score ?? '—'}</span>
              <span>{result.location ?? 'Unknown'}</span>
              <span>{result.school ?? 'Unknown'}</span>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Searchbar