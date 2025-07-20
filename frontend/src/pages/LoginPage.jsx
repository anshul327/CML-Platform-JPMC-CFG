import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Users, BookOpen, Shield } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('supervisor');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get redirect message from location state
  const redirectMessage = location.state?.message;

  // Auto-select role if preselectRole is provided in navigation state
  useEffect(() => {
    if (location.state?.preselectRole) {
      setSelectedRole(location.state.preselectRole);
    }
  }, [location.state]);

  // Form data for login
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Role configurations
  const roles = [
    {
      id: 'crp',
      name: 'CRP',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Community Resource Person - Manage farmers and training'
    },
    {
      id: 'expert',
      name: 'Expert',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Agricultural Expert - Provide guidance and advisories'
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Supervisor - Monitor and manage overall operations'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // API endpoint based on selected role
      const endpoints = {
        crp: '/api/crp-auth/login',
        expert: '/api/expert-auth/login',
        supervisor: '/api/supervisor-auth/login'
      };

      const response = await fetch(`http://localhost:3000${endpoints[selectedRole]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', selectedRole);
        localStorage.setItem('userData', JSON.stringify(data.data));
        
        // Navigate to appropriate dashboard based on user role
        const dashboardRoutes = {
          crp: '/crp-dashboard',
          expert: '/expert-dashboard',
          supervisor: '/supervisor-dashboard'
        };
        
        navigate(dashboardRoutes[selectedRole] || '/');
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = roles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-earth-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your account</p>
        </div>

        {/* Role Selection */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">Select Your Role</h3>
          <div className="grid grid-cols-3 gap-2">
            {roles.map((role) => {
              const IconComponent = role.icon;
              return (
                <button
                  key={role.id}
                  onClick={() => handleRoleChange(role.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedRole === role.id
                      ? `${role.bgColor} ${role.color} shadow-lg`
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <IconComponent className="h-5 w-5 mx-auto mb-1" />
                  {role.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${currentRole.bgColor} mr-3`}>
              <currentRole.icon className={`h-6 w-6 ${currentRole.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentRole.name} Login</h2>
              <p className="text-sm text-gray-600">{currentRole.description}</p>
            </div>
          </div>

          {redirectMessage && (
            <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-sm">
              {redirectMessage}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to={selectedRole ? `/register` : `/register`}
                state={selectedRole ? { preselectRole: selectedRole } : undefined}
                className="text-primary-600 hover:text-primary-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 