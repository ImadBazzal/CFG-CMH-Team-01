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

  return
};




  export default ResultsPage;
