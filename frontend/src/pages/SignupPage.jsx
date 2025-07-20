import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, Phone, MapPin, Building, Users, BookOpen, Shield, Calendar, FileText, Crop, Droplets } from 'lucide-react';

const SignupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState('supervisor');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Auto-select role if preselectRole is provided in navigation state
  React.useEffect(() => {
    if (location.state?.preselectRole) {
      setSelectedRole(location.state.preselectRole);
    }
  }, [location.state]);

  // Form data based on role
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    // CRP fields
    crpId: '',
    crpName: '',
    phone: '',
    // Expert fields
    expertId: '',
    expertName: '',
    specialization: '',
    experience: '',
    qualification: '',
    // Supervisor fields
    supervisorId: '',
    supervisorName: '',
    department: '',
    region: '',
    accessLevel: 'supervisor'
  });

  // Role configurations
  const roles = [
    {
      id: 'crp',
      name: 'CRP',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Register as Community Resource Person to manage farmers'
    },
    {
      id: 'expert',
      name: 'Expert',
      icon: BookOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Join as Agricultural Expert to provide guidance'
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      icon: Shield,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      description: 'Register as Supervisor to monitor operations'
    }
  ];

  // Form fields configuration based on role
  const getFormFields = (role) => {
    const baseFields = [
      { name: 'email', label: 'Email', type: 'email', icon: Mail, required: true },
      { name: 'password', label: 'Password', type: 'password', icon: Lock, required: true },
      { name: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: Lock, required: true }
    ];

    const roleSpecificFields = {
      crp: [
        { name: 'crpId', label: 'CRP ID', type: 'text', icon: User, required: true },
        { name: 'crpName', label: 'Full Name', type: 'text', icon: User, required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
        { name: 'district', label: 'District', type: 'text', icon: MapPin, required: true },
        { name: 'state', label: 'State', type: 'text', icon: MapPin, required: true }
      ],
      expert: [
        { name: 'expertId', label: 'Expert ID', type: 'text', icon: User, required: true },
        { name: 'expertName', label: 'Full Name', type: 'text', icon: User, required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
        { name: 'specialization', label: 'Specialization', type: 'text', icon: BookOpen, required: true },
        { name: 'experience', label: 'Years of Experience', type: 'number', icon: User, required: true },
        { name: 'qualification', label: 'Qualification', type: 'text', icon: BookOpen, required: true },
        { name: 'district', label: 'District', type: 'text', icon: MapPin, required: true },
        { name: 'state', label: 'State', type: 'text', icon: MapPin, required: true }
      ],
      supervisor: [
        { name: 'supervisorId', label: 'Supervisor ID', type: 'text', icon: User, required: true },
        { name: 'supervisorName', label: 'Full Name', type: 'text', icon: User, required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, required: true },
        { name: 'department', label: 'Department', type: 'text', icon: Building, required: true },
        { name: 'region', label: 'Region', type: 'text', icon: MapPin, required: true },
        { name: 'accessLevel', label: 'Access Level', type: 'select', icon: Shield, required: true, options: ['supervisor', 'manager'] }
      ]
    };

    return [...baseFields, ...(roleSpecificFields[role] || [])];
  };

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
    setSuccess('');
    // Reset form data when role changes
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      crpId: '',
      crpName: '',
      phone: '',
      expertId: '',
      expertName: '',
      specialization: '',
      experience: '',
      qualification: '',
      supervisorId: '',
      supervisorName: '',
      department: '',
      region: '',
      accessLevel: 'supervisor'
    });
  };

  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Check if all required fields are filled
    const formFields = getFormFields(selectedRole);
    const requiredFields = formFields.filter(field => field.required);
    
    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name].trim() === '') {
        setError(`${field.label} is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for the specific role
      const signupData = {
        email: formData.email,
        password: formData.password,
        role: selectedRole
      };

      // Add role-specific fields
      const roleFields = getFormFields(selectedRole);
      roleFields.forEach(field => {
        if (field.name !== 'email' && field.name !== 'password' && field.name !== 'confirmPassword') {
          signupData[field.name] = formData[field.name];
        }
      });

      // API endpoint based on role
      const endpoints = {
        crp: '/api/crp-auth/signup',
        expert: '/api/expert-auth/signup',
        supervisor: '/api/supervisor-auth/signup'
      };

      const response = await fetch(`http://localhost:3000${endpoints[selectedRole]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Please log in to continue.');
        // Clear form data
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          crpId: '',
          crpName: '',
          phone: '',
          expertId: '',
          expertName: '',
          specialization: '',
          experience: '',
          qualification: '',
          supervisorId: '',
          supervisorName: '',
          department: '',
          region: '',
          accessLevel: 'supervisor'
        });
        
        // Redirect to login after 2 seconds, with preselectRole
        setTimeout(() => {
          navigate('/login', { state: { preselectRole: selectedRole } });
        }, 2000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentRole = roles.find(role => role.id === selectedRole);
  const formFields = getFormFields(selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-earth-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
          <p className="text-gray-300">Join the Centre for Microfinance and Livelihood</p>
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

        {/* Signup Form */}
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="flex items-center mb-6">
            <div className={`p-2 rounded-lg ${currentRole.bgColor} mr-3`}>
              <currentRole.icon className={`h-6 w-6 ${currentRole.color}`} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{currentRole.name} Registration</h2>
              <p className="text-sm text-gray-600">{currentRole.description}</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {formFields.map((field) => {
                const IconComponent = field.icon;
                return (
                  <div key={field.name} className={field.name === 'password' || field.name === 'confirmPassword' ? 'md:col-span-2' : ''}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconComponent className="h-5 w-5 text-gray-400" />
                      </div>
                      {field.type === 'password' ? (
                        <div className="relative">
                          <input
                            type={field.name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleInputChange}
                            required={field.required}
                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            placeholder={`Enter your ${field.label.toLowerCase()}`}
                          />
                          <button
                            type="button"
                            onClick={() => field.name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          >
                            {field.name === 'password' ? 
                              (showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />) :
                              (showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />)
                            }
                          </button>
                        </div>
                      ) : field.type === 'select' ? (
                        <select
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                          className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          value={formData[field.name]}
                          onChange={handleInputChange}
                          required={field.required}
                          className="block w-full pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in here
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

export default SignupPage; 