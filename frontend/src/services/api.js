const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  searchSchools: async (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.school_name) queryParams.append('school_name', params.school_name);
    if (params.city) queryParams.append('city', params.city);
    if (params.state) queryParams.append('state', params.state);
    if (params.min_humanities) queryParams.append('min_humanities', params.min_humanities);
    if (params.max_humanities) queryParams.append('max_humanities', params.max_humanities);
    if (params.min_american_government) queryParams.append('min_american_government', params.min_american_government);
    if (params.max_american_government) queryParams.append('max_american_government', params.max_american_government);

    const response = await fetch(`${API_BASE_URL}/tests/search?${queryParams}`);
    if (!response.ok) throw new Error('Failed to search schools');
    return response.json();
  },

  filterSchools: async (filters) => {
    const response = await fetch(`${API_BASE_URL}/tests/filter`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    if (!response.ok) throw new Error('Failed to filter schools');
    return response.json();
  },

  updateScore: async (id, scores) => {
    const response = await fetch(`${API_BASE_URL}/tests/${id}/score`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scores),
    });
    if (!response.ok) throw new Error('Failed to update score');
    return response.json();
  },

  healthCheck: async () => {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }
};