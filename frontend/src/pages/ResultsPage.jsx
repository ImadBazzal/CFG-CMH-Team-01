import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Map from '../components/Map';
import { getCoordinates } from '../utils/coordinates';

const ResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Helper function to decode HTML entities in URL params
  const getDecodedParam = (param) => {
    const value = searchParams.get(param);
    if (!value) return '';
    // Decode HTML entities like &amp; to &
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  };

  const [filters, setFilters] = useState({
    clep_exam: getDecodedParam('clep_exam'),
    city: '',
    state: '',
    min_score: getDecodedParam('min_score'),
    maxCredits: '',
    maxTranscriptionFee: ''
  });

  // Update filters when URL params change
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      clep_exam: getDecodedParam('clep_exam'),
      min_score: getDecodedParam('min_score')
    }));
  }, [searchParams]);

  // fetch schools from backend
  useEffect(() => {
    // Use decoded URL params for initial load
    const initialFilters = {
      ...filters,
      clep_exam: getDecodedParam('clep_exam'),
      min_score: getDecodedParam('min_score')
    };
    fetchSchools(initialFilters);
  }, [searchParams]);

  const fetchSchools = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError(null);

      // build query params from current filters
      const params = new URLSearchParams();
      if (currentFilters.city) params.append('city', currentFilters.city);
      if (currentFilters.state) params.append('state', currentFilters.state);
      
      if (currentFilters.clep_exam === 'Humanities') {
        if (currentFilters.min_score) {
          params.append('max_humanities', currentFilters.min_score);
        } else {
          params.append('min_humanities', '0'); // Show all humanities scores
        }
      } else if (currentFilters.clep_exam === 'American Government') {
        if (currentFilters.min_score) {
          params.append('max_american_government', currentFilters.min_score);
        } else {
          params.append('min_american_government', '0'); // Show all american government scores
        }
      }

      const apiUrl = `http://localhost:8000/api/tests/search?${params}`;
      console.log('Fetching schools with URL:', apiUrl);
      console.log('Current filters:', currentFilters);
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch schools');

      const result = await response.json();
      console.log('API response:', result);

      // Transform backend data to match frontend structure
      // Based on MS Sample SMALL table structure
      const transformedSchools = result.data.map((school, index) => {
        // Generate realistic data based on school index for consistency
        const seed = school['School Name']?.length || index;
        const enrollment = 10000 + (seed * 137) % 40000;
        const maxCredits = 15 + (seed * 7) % 16; // 15-30 credits
        const transcriptionFee = 25 + (seed * 13) % 76; // $25-$100
        const scoreValidity = 2 + (seed * 3) % 4; // 2-5 years
        const canEnrolledUse = (seed * 17) % 3 !== 0; // ~67% yes
        const canUseForFailed = (seed * 23) % 4 !== 0; // ~75% yes
        
        return {
          id: school.id || index + 1,
          name: school['School Name'] || 'Unknown School',
          city: school.City || 'Unknown',
          state: school.State || 'Unknown',
          location: `${school.City || 'Unknown'}, ${school.State || 'Unknown'}`,
          humanities: school.Humanities,
          americanGovernment: school['American Government'],
          diCode: school['DI Code'],
          enrollment,
          maxCredits,
          transcriptionFee,
          scoreValidity,
          canEnrolledStudentsUseCLEP: canEnrolledUse,
          canUseForFailedCourses: canUseForFailed,
          // Use accurate coordinates based on city/state
          ...(() => {
            const [lat, lng] = getCoordinates(school.City, school.State, index);
            return { lat, lng };
          })(),
        };
      });

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

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    fetchSchools(filters);
  };

  // UI
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* MAP */}
      <div className="absolute inset-0 z-10">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-medium">Loading CLEP Institutions...</p>
            </div>
          </div>
        ) : (
          <Map 
            schools={schools} 
            onSchoolClick={setSelectedSchool} 
            selectedSchool={selectedSchool}
          />
        )}
        
        {/* legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-3 z-40">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span className="text-gray-700 font-medium">Accepts CLEP Credit</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {schools.length} schools found
          </div>
        </div>
      </div>

      {/* FILTER SIDEBAR */}
      <div className="absolute top-6 left-6 z-50 w-80 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-5">
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
              <option value="Algebra">Algebra</option>
              <option value="Humanities">Humanities</option>
              <option value="American Government">American Government</option>
              <option value="Biology">Biology</option>
              <option value="Chemistry">Chemistry</option>
              <option value="College Composition">College Composition</option>
              <option value="History of the United States">History of the United States</option>
              <option value="Principles of Management">Principles of Management</option>
              <option value="Spanish">Spanish</option>
              <option value="Other">Other</option>
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
      <div className="absolute top-6 right-6 z-50 w-96 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg p-5">
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
