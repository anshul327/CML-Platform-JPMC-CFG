import { API_BASE_URL, ENDPOINTS } from '../utils/constants';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Farmer API functions
export const farmerAPI = {
  getAll: () => apiRequest(ENDPOINTS.FARMERS + '/all'),
  getById: (id) => apiRequest(ENDPOINTS.FARMERS + `/${id}`),
  create: (data) => apiRequest(ENDPOINTS.FARMERS + '/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(ENDPOINTS.FARMERS + `/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(ENDPOINTS.FARMERS + `/${id}`, {
    method: 'DELETE',
  }),
};

// CRP API functions
export const crpAPI = {
  getAll: () => apiRequest(ENDPOINTS.CRP + '/all'),
  getById: (id) => apiRequest(ENDPOINTS.CRP + `/${id}`),
  create: (data) => apiRequest(ENDPOINTS.CRP + '/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(ENDPOINTS.CRP + `/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(ENDPOINTS.CRP + `/${id}`, {
    method: 'DELETE',
  }),
};

// Expert API functions
export const expertAPI = {
  getAll: () => apiRequest(ENDPOINTS.EXPERT + '/all'),
  getById: (id) => apiRequest(ENDPOINTS.EXPERT + `/${id}`),
  create: (data) => apiRequest(ENDPOINTS.EXPERT + '/create', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(ENDPOINTS.EXPERT + `/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(ENDPOINTS.EXPERT + `/${id}`, {
    method: 'DELETE',
  }),
};

// Dashboard API functions
export const dashboardAPI = {
  getOverview: () => apiRequest(ENDPOINTS.DASHBOARD + '/overview'),
  getAggregatedData: () => apiRequest(ENDPOINTS.DASHBOARD + '/farmers/aggregated'),
  getCRPReports: () => apiRequest(ENDPOINTS.DASHBOARD + '/crp-reports'),
  getExpertRecommendations: () => apiRequest(ENDPOINTS.DASHBOARD + '/expert-recommendations'),
  createFollowUp: (data) => apiRequest(ENDPOINTS.DASHBOARD + '/follow-up', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateFollowUp: (id, data) => apiRequest(ENDPOINTS.DASHBOARD + `/follow-up/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  exportData: (type) => apiRequest(ENDPOINTS.DASHBOARD + `/export/${type}`),
}; 