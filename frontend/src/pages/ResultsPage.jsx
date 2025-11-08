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
  clep_exam: getDecodedParam('clep_exam') ? [getDecodedParam('clep_exam')] : [],
  city: '',
  state: '',
  min_score: getDecodedParam('min_score'),
  maxCredits: '',
  maxTranscriptionFee: ''
});

const [showReportForm, setShowReportForm] = useState(false);
const [reportData, setReportData] = useState({
  institutionName: '',
  clepExams: []
});

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
      const transformedSchools = result.data.map((school, index) => ({
        id: school.id || index + 1,
        name: school['School Name'] || 'Unknown School',
        city: school.City || 'Unknown',
        state: school.State || 'Unknown',
        location: `${school.City || 'Unknown'}, ${school.State || 'Unknown'}`,
        humanities: school.Humanities,
        americanGovernment: school['American Government'],
        diCode: school['DI Code'],




        // Generate realistic data based on school index for consistency
        enrollment: 10000 + ((school['School Name']?.length || index) * 137) % 40000,
        maxCredits: 15 + ((school['School Name']?.length || index) * 7) % 16,
        transcriptionFee: 25 + ((school['School Name']?.length || index) * 13) % 76,
        scoreValidity: 2 + ((school['School Name']?.length || index) * 3) % 4,
        canEnrolledStudentsUseCLEP: ((school['School Name']?.length || index) * 17) % 3 !== 0,
        canUseForFailedCourses: ((school['School Name']?.length || index) * 23) % 4 !== 0,
        // Use accurate coordinates based on city/state
        ...(() => {
          const [lat, lng] = getCoordinates(school.City, school.State, index);
          return { lat, lng };
        })(),
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

  const handleReportSubmit = async (e) => {
  e.preventDefault();
  
  try {
    // Send report to backend
    const response = await fetch('http://localhost:8000/api/reports/outdated', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });
    
    if (response.ok) {
      alert('Thank you for your report! We will review the information.');
      setShowReportForm(false);
      setReportData({ institutionName: '', clepExams: [] });
    } else {
      alert('Failed to submit report. Please try again.');
    }
  } catch (err) {
    console.error('Error submitting report:', err);
    alert('Failed to submit report. Please try again.');
  }
};

const handleClepExamFilterToggle = (exam) => {
  setFilters(prev => ({
    ...prev,
    clep_exam: prev.clep_exam.includes(exam)
      ? prev.clep_exam.filter(e => e !== exam)
      : [...prev.clep_exam, exam]
  }));
};

const handleClepExamToggle = (exam) => {
  setReportData(prev => ({
    ...prev,
    clepExams: prev.clepExams.includes(exam)
      ? prev.clepExams.filter(e => e !== exam)
      : [...prev.clepExams, exam]
  }));
};

  const handleFilterChange = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleApplyFilters = () => {
    console.log('Applying filters:', filters);
    fetchSchools(filters);
  };

  // UI
  return (
    <div className="relative w-screen min-h-[calc(100vh-4rem)] overflow-hidden mt-16 bg-[radial-gradient(circle_at_15%_20%,rgba(71,134,255,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(255,86,180,0.25),transparent_40%),linear-gradient(135deg,#030712,#020310_55%,#050917)]">
      {/* MAP */}
      <div className="absolute inset-0 z-10">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center bg-[#030712]">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-white/60 mx-auto mb-4" />
              <p className="text-white/70 text-lg font-medium">Loading CLEP Institutions...</p>
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
        <div className="absolute bottom-4 left-4 z-40 rounded-2xl border border-white/10 bg-gradient-to-br from-[#070916]/90 via-[#0b0f25]/90 to-[#0f1635]/85 px-4 py-3 shadow-[0_15px_35px_rgba(5,9,23,0.45)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-sm text-white">
            <div className="w-3 h-3 bg-[#6f7dff] rounded-full"></div>
            <span className="font-medium text-white/80">Accepts CLEP Credit</span>
          </div>
          <div className="text-xs text-white/60 mt-1">
            {schools.length} schools found
          </div>
        </div>
      </div>

      {/* FILTER SIDEBAR */}
      <div className="absolute top-6 left-6 z-50 w-80 rounded-3xl border border-white/10 bg-gradient-to-br from-[#070916]/95 via-[#0b0f25]/90 to-[#131b3c]/85 p-5 shadow-[0_25px_45px_rgba(5,8,24,0.55)] backdrop-blur-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-[#7f8fff]" />
          <h2 className="font-semibold text-white tracking-[0.08em] uppercase text-xs">
            Filters
          </h2>
        </div>

        <div className="space-y-4">
          
        {/* CLEP exam */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">CLEP Exam Type (select all that apply)</label>
          <div className="border border-white/10 rounded-xl max-h-32 overflow-y-auto p-3 space-y-2 bg-white/5">
            {[
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
            ].map((exam) => (
              <label key={exam} className="flex items-center space-x-2 cursor-pointer rounded-xl px-2 py-1 text-white/80 hover:bg-white/10">
                <input
                  type="checkbox"
                  checked={filters.clep_exam.includes(exam)}
                  onChange={() => handleClepExamFilterToggle(exam)}
                  className="w-4 h-4 text-[#6f7dff] border-white/20 rounded focus:ring-[#6f7dff]"
                />
                <span className="text-sm">{exam}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {filters.clep_exam.length > 0 ? `${filters.clep_exam.length} exam(s) selected` : 'No exams selected'}
          </p>
        </div>

         {/* min score */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">
            Minimum CLEP Score
          </label>
          <input
            type="number"
            value={filters.min_score}
            onChange={(e) => handleFilterChange('min_score', e.target.value)}
            placeholder="e.g. 50"
            min="20"
            max="80"
            className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80"
          />
        </div>

        {/* last updated */}
        <div>
          <label className="block text-sm font-medium text-white/80 mb-1">Institution Policy Last Updated</label>
          <select
            value={filters.last_updated}
            onChange={(e) => handleFilterChange('last_updated', e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80"
          >
            <option value="">Any time</option>
            <option value="1-6">1-6 months ago</option>
            <option value="6-12">6-12 months ago</option>
            <option value="12+">1+ years ago</option>
          </select>
        </div>

          {/* city */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => handleFilterChange('city', e.target.value)}
              placeholder="e.g. Boston"
              className="w-full px-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80"
            />
          </div>

          {/* state */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">State</label>
            <select
              value={filters.state}
              onChange={(e) => handleFilterChange('state', e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80"
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
            <label className="block text-sm font-medium text-white/80 mb-1">
              Max Transcription Fee
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60">$</span>
              <input
                type="number"
                value={filters.maxTranscriptionFee}
                onChange={(e) => handleFilterChange('maxTranscriptionFee', e.target.value)}
                placeholder="100"
                className="w-full pl-8 pr-3 py-2 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80"
              />
            </div>
          </div>

          <button
            onClick={handleApplyFilters}
            className="w-full bg-gradient-to-r from-[#6f7dff] via-[#7f5dff] to-[#5ecfff] text-[#050812] py-2.5 px-4 rounded-2xl font-semibold tracking-wide shadow-[0_15px_35px_rgba(110,125,255,0.35)] transition-all duration-200 hover:-translate-y-0.5"
          >
            Apply Filters
          </button>
        </div>
      </div>
      {/* REPORT BUTTON */}
      <button
        onClick={() => setShowReportForm(true)}
        className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-[#6f7dff] via-[#7f5dff] to-[#f97bff] px-7 py-3 text-white text-sm font-semibold tracking-wide shadow-[0_18px_45px_rgba(111,125,255,0.35)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_25px_55px_rgba(111,125,255,0.45)]"
      >
        Report Outdated Institution Information
      </button>

      {/* REPORT FORM POPUP */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-md max-h-[80vh] overflow-y-auto rounded-3xl border border-white/10 bg-gradient-to-br from-[#070916]/95 via-[#131b3c]/90 to-[#1a1e3f]/85 shadow-[0_30px_65px_rgba(4,6,15,0.7)]">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Report Outdated Information</h3>
                <button
                  onClick={() => setShowReportForm(false)}
                  className="text-white/50 hover:text-white/80 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Institution Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportData.institutionName}
                    onChange={(e) => setReportData(prev => ({ ...prev, institutionName: e.target.value }))}
                    placeholder="Enter institution name"
                    className="w-full px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-white placeholder-white/40 focus:ring-2 focus:ring-[#f97bff]/60 focus:border-[#f97bff]/80"
                  />
                </div>

                {/* CLEP Exam Types */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    CLEP Exam Types * (select all that apply)
                  </label>
                  <div className="border border-white/10 rounded-2xl max-h-48 overflow-y-auto p-3 space-y-2 bg-white/5">
                    {[
                      'All policies',
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
                    ].map((exam) => (
                      <label key={exam} className="flex items-center space-x-2 cursor-pointer rounded-xl px-2 py-1 text-white/80 hover:bg-white/10">
                        <input
                          type="checkbox"
                          checked={reportData.clepExams.includes(exam)}
                          onChange={() => handleClepExamToggle(exam)}
                          className="w-4 h-4 text-[#ff6b8f] border-white/20 rounded focus:ring-[#ff6b8f]"
                        />
                        <span className="text-sm">{exam}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-white/60 mt-1">
                    {reportData.clepExams.length} exam(s) selected
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="flex-1 px-4 py-2 rounded-2xl border border-white/15 text-white/80 hover:bg-white/5 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!reportData.institutionName || reportData.clepExams.length === 0}
                    className="flex-1 px-4 py-2 rounded-2xl bg-gradient-to-r from-[#ff6b8f] via-[#ff4d6d] to-[#f97bff] text-white font-semibold shadow-[0_12px_28px_rgba(255,107,143,0.35)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* SCHOOL DROPDOWN */}
      <div className="absolute top-6 right-6 z-50 w-96 rounded-3xl border border-white/10 bg-gradient-to-br from-[#070916]/95 via-[#0b0f25]/90 to-[#131b3c]/85 p-5 shadow-[0_25px_45px_rgba(5,8,24,0.55)] backdrop-blur-2xl">
        <label className="block text-sm font-medium text-white/80 mb-2 tracking-wide uppercase">Select a School</label>
        <select
          value={selectedSchool}
          onChange={(e) => setSelectedSchool(e.target.value)}
          className="w-full px-4 py-3 bg-gray-800 border border-white/15 rounded-2xl text-white focus:ring-2 focus:ring-[#6f7dff]/60 focus:border-[#6f7dff]/80 text-base"
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
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white shadow-inner shadow-black/20">
            {(() => {
              const school = schools.find((s) => s.id === selectedSchool);
              if (!school) return null;
              return (
                <>
                  <h3 className="font-semibold text-white mb-2 text-base">{school.name}</h3>
                  <p className="text-white/70">{school.location}</p>
                  <p className="text-white/60 mt-2">
                    Enrollment: {school.enrollment?.toLocaleString() || 'N/A'}
                  </p>
                  <p className="text-white/60">
                    Max CLEP Credits: {school.maxCredits || 'N/A'}
                  </p>
                  <p className="text-white/60">
                    Transcription Fee: ${school.transcriptionFee || 'N/A'}
                  </p>
                  <p className="text-white/60">
                    Score Validity: {school.scoreValidity || 'N/A'} years
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/70 text-sm">Enrolled Students Can Use:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        school.canEnrolledStudentsUseCLEP
                          ? 'bg-green-400/20 text-green-200'
                          : 'bg-red-400/20 text-red-200'
                      }`}
                    >
                      {school.canEnrolledStudentsUseCLEP ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-white/70 text-sm">Use for Failed Courses:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        school.canUseForFailedCourses
                          ? 'bg-green-400/20 text-green-200'
                          : 'bg-red-400/20 text-red-200'
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
                      className="text-[#7f8fff] hover:text-white text-sm font-medium mt-3 inline-block"
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
