import React, { useState, useEffect } from 'react';
import { MapPin, Filter } from 'lucide-react';

const ResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    clep_exam: '',
    city: '',
    state: '',
    maxCredits: '',
    maxTranscriptionFee: ''
  });

  // Fetch schools from backend
  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query parameters based on filters
      const params = new URLSearchParams();
      if (filters.city) params.append('city', filters.city);
      if (filters.state) params.append('state', filters.state);
      
      // Use correct backend API endpoint
      const response = await fetch(`http://localhost:8000/api/tests/search?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch schools');
      }
      
      const result = await response.json();
      
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
        diCode: school['DI Code']
      }));
      
      // Apply frontend filters
      let filteredSchools = transformedSchools;
      
      if (filters.maxCredits) {
        filteredSchools = filteredSchools.filter(
          school => school.maxCredits >= parseInt(filters.maxCredits)
        );
      }
      
      if (filters.maxTranscriptionFee) {
        filteredSchools = filteredSchools.filter(
          school => school.transcriptionFee <= parseInt(filters.maxTranscriptionFee)
        );
      }
      
      setSchools(filteredSchools);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching schools:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    fetchSchools();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CLEP College Credit Search</h1>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {error}
          </div>
        )}
        
        <div className="flex gap-6">
          {/* Filter section */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-4">
                {/* CLEP Exam Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CLEP Exam
                  </label>
                  <select
                    value={filters.clep_exam}
                    onChange={(e) => handleFilterChange('clep_exam', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All CLEP Exams</option>
                    <option value="1">American Government</option>
                    <option value="2">American Literature</option>
                    <option value="3">Analyzing and Interpreting Literature</option>
                    <option value="4">Biology</option>
                    <option value="5">Calculus</option>
                    <option value="6">Chemistry</option>
                    <option value="7">College Algebra</option>
                    <option value="8">College Composition</option>
                    <option value="9">College Composition Modular</option>
                    <option value="10">College Mathematics</option>
                    <option value="11">English Literature</option>
                    <option value="12">Financial Accounting</option>
                    <option value="13">French Language Level I</option>
                    <option value="14">French Language Level II</option>
                    <option value="15">German Language Level I</option>
                    <option value="16">German Language Level II</option>
                    <option value="17">History of the United States I</option>
                    <option value="18">History of the United States II</option>
                    <option value="19">Human Growth and Development</option>
                    <option value="20">Humanities</option>
                    <option value="21">Information Systems</option>
                    <option value="22">Introduction to Educational Psychology</option>
                    <option value="23">Introductory Business Law</option>
                    <option value="24">Introductory Psychology</option>
                    <option value="25">Introductory Sociology</option>
                    <option value="26">Natural Sciences</option>
                    <option value="27">Precalculus</option>
                    <option value="28">Principles of Macroeconomics</option>
                    <option value="29">Principles of Management</option>
                    <option value="30">Principles of Marketing</option>
                    <option value="31">Principles of Microeconomics</option>
                    <option value="32">Social Sciences and History</option>
                    <option value="33">Spanish Language Level I</option>
                    <option value="34">Spanish Language Level II</option>
                    <option value="35">Spanish With Writing Level I</option>
                    <option value="36">Spanish With Writing Level II</option>
                    <option value="37">Western Civilization I</option>
                    <option value="38">Western Civilization II</option>
                  </select>
                </div>

                {/* Minimum Credits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum CLEP Credits Accepted
                  </label>
                  <input
                    type="number"
                    value={filters.maxCredits}
                    onChange={(e) => handleFilterChange('maxCredits', e.target.value)}
                    placeholder="e.g., 30"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum credits school accepts
                  </p>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    placeholder="e.g., Boston"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State
                  </label>
                  <select
                    value={filters.state}
                    onChange={(e) => handleFilterChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All States</option>
                    <option value="CA">California</option>
                    <option value="FL">Florida</option>
                    <option value="IL">Illinois</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MD">Maryland</option>
                    <option value="MI">Michigan</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NY">New York</option>
                    <option value="OH">Ohio</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>

                {/* Maximum Transcription Fee */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Transcription Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={filters.maxTranscriptionFee}
                      onChange={(e) => handleFilterChange('maxTranscriptionFee', e.target.value)}
                      placeholder="100"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Fee to process CLEP credits
                  </p>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Map and School Dropdown */}
          <div className="flex-1">
            {/* School dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a School
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading schools...' : 'Choose a school...'}
                </option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name} - {school.location}
                  </option>
                ))}
              </select>
              {loading && (
                <p className="text-sm text-gray-500 mt-1">Searching for schools that accept CLEP...</p>
              )}
              {!loading && schools.length === 0 && (
                <p className="text-sm text-gray-500 mt-1">No schools found matching your criteria</p>
              )}
              {!loading && schools.length > 0 && (
                <p className="text-sm text-green-600 mt-1">Found {schools.length} schools</p>
              )}
            </div>

            {/* Map */}
            <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {[...Array(96)].map((_, i) => (
                      <div key={i} className="border border-gray-700"></div>
                    ))}
                  </div>
                </div>
                
                {/* Map placeholder content */}
                <div className="relative z-10 text-center">
                  <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">Interactive Map</p>
                  <p className="text-gray-500 text-sm mt-2">School locations will appear here</p>
                </div>

                {/* Map markers - these would be dynamically positioned based on school locations */}
                {schools.slice(0, 5).map((school, index) => (
                  <div 
                    key={school.id}
                    className="absolute w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg cursor-pointer hover:bg-blue-700"
                    style={{
                      top: `${20 + index * 15}%`,
                      left: `${25 + index * 10}%`
                    }}
                    title={school.name}
                  />
                ))}
                
                {/* Map controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-xl">
                    +
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-xl">
                    −
                  </button>
                </div>

                {/* Map legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">Accepts CLEP Credit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected school info */}
            {selectedSchool && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                {(() => {
                  const school = schools.find(s => s.id === selectedSchool);
                  return school ? (
                    <>
                      <h3 className="font-semibold text-gray-900 mb-3 text-lg">{school.name}</h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="text-gray-900 font-medium">{school.location}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">DI Code:</span>
                          <span className="text-gray-900 font-medium">{school.diCode || 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Humanities Score:</span>
                          <span className="text-gray-900 font-medium">{school.humanities !== 'NULL' ? school.humanities : 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">American Government Score:</span>
                          <span className="text-gray-900 font-medium">{school.americanGovernment !== 'NULL' ? school.americanGovernment : 'N/A'}</span>
                        </div>
                      </div>
                      

                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
