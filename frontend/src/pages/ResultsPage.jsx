import React, { useState } from 'react';
import { MapPin, Filter } from 'lucide-react';

// Assuming FilterComponent and SchoolCard are defined in the same directory
const ResultsPage = () => {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [filters, setFilters] = useState({
    test: 'CLEP',
    score: '50+',
    city: '',
    state: '',
    maxCost: ''
  });

  // Example set of schools to display, with their id, name, and location
  const schools = [
    { id: 1, name: 'University of California, Berkeley', location: 'Berkeley, CA' },
    { id: 2, name: 'Boston University', location: 'Boston, MA' },
    { id: 3, name: 'University of Texas at Austin', location: 'Austin, TX' },
    { id: 4, name: 'University of Michigan', location: 'Ann Arbor, MI' },
    { id: 5, name: 'New York University', location: 'New York, NY' },
    { id: 6, name: 'University of Washington', location: 'Seattle, WA' }
  ];

  // Reference changes based off values of key
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">School Search Results</h1>
        
        <div className="flex gap-6">
          {/* filter section */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-gray-700" />
                <h2 className="font-semibold text-gray-900">Filters</h2>
              </div>

              <div className="space-y-4">
                {/* test type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Test Type
                  </label>
                  <select
                    value={filters.test}
                    onChange={(e) => handleFilterChange('test', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="SAT">SAT</option>
                    <option value="ACT">ACT</option>
                  </select>
                </div>

                {/* score */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Score
                  </label>
                  <select
                    value={filters.score}
                    onChange={(e) => handleFilterChange('score', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1000+">1000+</option>
                    <option value="1100+">1100+</option>
                    <option value="1200+">1200+</option>
                    <option value="1300+">1300+</option>
                    <option value="1400+">1400+</option>
                  </select>
                </div>

                {/* city */}
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

                {/* state */}
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
                    <option value="MA">Massachusetts</option>
                    <option value="TX">Texas</option>
                    <option value="MI">Michigan</option>
                    <option value="NY">New York</option>
                    <option value="WA">Washington</option>
                  </select>
                </div>

                {/* max transcription fee */}
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
                      value={filters.maxCost}
                      onChange={(e) => handleFilterChange('maxCost', e.target.value)}
                      placeholder="5000"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          {/* MAP AND SCHOOL DROPDOWN */}
          <div className="flex-1">
            {/* school dropdown */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a School
              </label>
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="">Choose a school...</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>
                    {school.name} - {school.location}
                  </option>
                ))}
              </select>
            </div>

            {/* map */}
            <div className="bg-gray-900 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <div className="w-full h-full flex items-center justify-center relative">
                {/* grid pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                    {[...Array(96)].map((_, i) => (
                      <div key={i} className="border border-gray-700"></div>
                    ))}
                  </div>
                </div>
                
                {/* map placeholder content */}
                <div className="relative z-10 text-center">
                  <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg font-medium">Interactive Map</p>
                  <p className="text-gray-500 text-sm mt-2">School locations will appear here</p>
                </div>

                {/* map markers */}
                <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
                
                {/* map controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-xl">
                    +
                  </button>
                  <button className="w-10 h-10 bg-white rounded-lg shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 font-bold text-xl">
                    −
                  </button>
                </div>

                {/* map legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-4 py-3">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 font-medium">School Location</span>
                  </div>
                </div>
              </div>
            </div>

            {/* selected school info */}
            {selectedSchool && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Selected School</h3>
                <p className="text-gray-700">
                  {schools.find(s => s.id === parseInt(selectedSchool))?.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {schools.find(s => s.id === parseInt(selectedSchool))?.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
