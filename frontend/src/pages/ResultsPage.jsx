import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clep_exam: searchParams.get('clep_exam') || '',
    city: '',
    state: '',
    min_score: searchParams.get('min_score') || '',
    maxCredits: '',
    maxTranscriptionFee: ''
  });

  // fetch schools from backend
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);

      // build query params
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      if (filters.clep_exam) params.append('clep_exam', filters.clep_exam);
      if (filters.min_score) params.append('min_score', filters.min_score);

      // Use correct backend API endpoint
      const response = await fetch(`http://localhost:8000/api/tests/search?${params}`);
      if (!response.ok) throw new Error('Failed to fetch schools');

      const result = await response.json();

      // ... rest of the function stays the same

      // Transform backend data to match frontend structure
      // Based on MS Sample SMALL table structure
      const transformedSchools = result.data.map((school, index) => ({
        id: school.id || index + 1,
        name: school['School Name'] || 'Unknown School',
        city: school.City || 'Unknown',
        state: school.State || 'Unknown',
        location: `${school.City || 'Unknown'}, ${school.State || 'Unknown'}`,
        humanities: school.Humanities,
        americanGovernment: school['American Government'],
        diCode: school['DI Code'],
        // fake coordinates for map placement
        lat: 37 + Math.random() * 10,
        lng: -95 + Math.random() * 20,
      }));

      // apply frontend filters
      let filtered = transformedSchools;
      if (filters.maxCredits)
        filtered = filtered.filter((s) => s.maxCredits >= parseInt(filters.maxCredits));
      if (filters.maxTranscriptionFee)
        filtered = filtered.filter(
          (s) => s.transcriptionFee <= parseInt(filters.maxTranscriptionFee)
        );

      setSchools(filtered);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => fetchSchools();

  // UI
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* MAP BACKGROUND */}
      <div className="absolute inset-0 bg-gray-900">
        <div className="w-full h-full flex items-center justify-center relative">
          {/* subtle grid overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
              {[...Array(96)].map((_, i) => (
                <div key={i} className="border border-gray-700"></div>
              ))}
            </div>
          </div>

          {/* map placeholder center text */}
          <div className="relative z-10 text-center">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-medium">
              {loading ? 'Loading CLEP Institutions...' : 'Interactive Map'}
            </p>
            <p className="text-gray-500 text-sm mt-2">
              {schools.length
                ? `${schools.length} schools found`
                : loading
                ? 'Fetching data from registrar directory...'
                : 'No results — adjust filters'}
            </p>
          </div>

          {/* dynamic map markers */}
          {schools.slice(0, 20).map((school, index) => (
            <div
              key={school.id}
              className="absolute w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-blue-700"
              style={{
                top: `${20 + (index * 11) % 60}%`,
                left: `${25 + (index * 7) % 50}%`,
              }}
              title={school.name}
              onClick={() => setSelectedSchool(school.id)}
            />
          ))}

          {/* legend */}
          <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-3 z-20">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span className="text-gray-700 font-medium">Accepts CLEP Credit</span>
            </div>

          </div>
        </div>
      </div>

      {/* FILTER SIDEBAR */}
      <div className="absolute top-6 left-6 z-30 w-80 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-700" />
          <h2 className="font-semibold text-gray-900">Filters</h2>
        </div>

        <div className="space-y-4">
          {/* CLEP exam */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CLEP Exam Type</label>
            <select
              value={filters.clep_exam}
              onChange={(e) => handleFilterChange('clep_exam', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All CLEP Exams</option>
              <option value="American Government">American Government</option>
              <option value="American Literature">American Literature</option>
              <option value="Analyzing & Interpreting Literature">Analyzing & Interpreting Literature</option>
              <option value="Biology">Biology</option>
              <option value="Calculus">Calculus</option>
              <option value="Chemistry">Chemistry</option>
              <option value="College Algebra">College Algebra</option>
              <option value="College Composition">College Composition</option>
              <option value="College Mathematics">College Mathematics</option>
              <option value="English Literature">English Literature</option>
              <option value="Financial Accounting">Financial Accounting</option>
              <option value="French Language">French Language</option>
              <option value="German Language">German Language</option>
              <option value="History of the United States I">History of the United States I</option>
              <option value="History of the United States II">History of the United States II</option>
              <option value="Human Growth and Development">Human Growth and Development</option>
              <option value="Information Systems">Information Systems</option>
              <option value="Introductory Business Law">Introductory Business Law</option>
              <option value="Introductory Psychology">Introductory Psychology</option>
              <option value="Introductory Sociology">Introductory Sociology</option>
              <option value="Natural Sciences">Natural Sciences</option>
              <option value="Precalculus">Precalculus</option>
              <option value="Principles of Macroeconomics">Principles of Macroeconomics</option>
              <option value="Principles of Microeconomics">Principles of Microeconomics</option>
              <option value="Principles of Management">Principles of Management</option>
              <option value="Principles of Marketing">Principles of Marketing</option>
              <option value="Spanish Language">Spanish Language</option>
              <option value="Western Civilization I">Western Civilization I</option>
              <option value="Western Civilization II">Western Civilization II</option>
            </select>
          </div>

         {/* min score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Minimum CLEP Score
          </label>
          <input
            type="number"
            value={filters.min_score}
            onChange={(e) => handleFilterChange('min_score', e.target.value)}
            placeholder="e.g. 50"
            min="20"
            max="80"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* last updated */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Institution Policy Last Updated</label>
          <select
            value={filters.last_updated}
            onChange={(e) => handleFilterChange('last_updated', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Any time</option>
            <option value="1-6">1-6 months ago</option>
            <option value="6-12">6-12 months ago</option>
            <option value="12+">1+ years ago</option>
          </select>
        </div>

          {/* city */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g. Boston"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* state */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All States</option>
              <option value="CA">California</option>
              <option value="FL">Florida</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="OH">Ohio</option>
            </select>
          </div>

          {/* max fee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Transcription Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                value={filters.maxTranscriptionFee}
                onChange={(e) => handleFilterChange('maxTranscriptionFee', e.target.value)}
                placeholder="100"
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* SCHOOL DROPDOWN */}
      <div className="absolute top-6 right-6 z-30 w-96 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select a School</label>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
          disabled={loading}
        >
          <option value="">
            {loading ? 'Loading schools...' : 'Choose a school...'}
          </option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name} — {school.location}
            </option>
          ))}
        </select>

        {selectedSchool && (
          <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4 text-sm">
            {(() => {
              const school = schools.find((s) => s.id === selectedSchool);
              if (!school) return null;
              return (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2">{school.name}</h3>
                  <p className="text-gray-700">{school.location}</p>
                  <p className="text-gray-500 mt-2">
                    Enrollment: {school.enrollment?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    Max CLEP Credits: {school.maxCredits || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    Transcription Fee: ${school.transcriptionFee || 'N/A'}
                  </p>
                  <p className="text-gray-500">
                    Score Validity: {school.scoreValidity || 'N/A'} years
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600 text-sm">Enrolled Students Can Use:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        school.canEnrolledStudentsUseCLEP
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {school.canEnrolledStudentsUseCLEP ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-gray-600 text-sm">Use for Failed Courses:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        school.canUseForFailedCourses
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {school.canUseForFailedCourses ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {school.clepWebUrl && (
                    <a
                      href={school.clepWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-3 inline-block"
                    >
                      View CLEP Policy →
                    </a>
                  )}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
