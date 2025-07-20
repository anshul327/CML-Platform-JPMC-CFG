// API Base URL
export const API_BASE_URL = 'http://localhost:3000/api';

// API Endpoints
export const ENDPOINTS = {
  FARMERS: '/farmers',
  CRP: '/crp',
  EXPERT: '/expert',
  DASHBOARD: '/dashboard'
};

// Feature Cards Data
export const FEATURES = [
  {
    id: 'farmers',
    icon: '👨‍🌾',
    title: 'Farmers',
    description: 'Manage farmer details and information',
    color: 'green'
  },
  {
    id: 'crp',
    icon: '📋',
    title: 'CRP Reports',
    description: 'Track field executive reports',
    color: 'blue'
  },
  {
    id: 'expert',
    icon: '🔬',
    title: 'Expert Reviews',
    description: 'Agricultural expert recommendations',
    color: 'purple'
  }
];

// Form validation rules
export const VALIDATION_RULES = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  minLength: (min) => `Minimum ${min} characters required`,
  maxLength: (max) => `Maximum ${max} characters allowed`
}; 