import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, User, Phone, MapPin, Crop, Droplets, AlertCircle, CheckCircle } from 'lucide-react';

const AddFarmerForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userRole, setUserRole] = useState('');

  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    
    if (!token) {
      navigate('/login', { state: { message: 'Please login to access this page' } });
      return;
    }
    
    if (role !== 'crp') {
      navigate('/crp-dashboard', { state: { message: 'Access denied. Only CRPs can add farmers.' } });
      return;
    }
    
    setUserRole(role);
  }, [navigate]);

  const [formData, setFormData] = useState({
    farmerId: '',
    fullName: '',
    age: '',
    gender: '',
    contactNumber: '',
    village: '',
    district: '',
    state: '',
    landSize: '',
    landUnit: 'acres',
    cropGrown: '',
    typeOfIrrigation: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
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
    const requiredFields = [
      'farmerId', 'fullName', 'age', 'gender', 'contactNumber', 
      'village', 'district', 'state', 'landSize', 'cropGrown', 
      'typeOfIrrigation', 'email', 'password'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        setError(`${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required`);
        return false;
      }
    }

    // Validate age
    if (formData.age < 18 || formData.age > 100) {
      setError('Age must be between 18 and 100');
      return false;
    }

    // Validate contact number
    if (formData.contactNumber.length < 10) {
      setError('Contact number must be at least 10 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:3000/api/farmer-auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          farmerId: formData.farmerId,
          fullName: formData.fullName,
          age: parseInt(formData.age),
          gender: formData.gender,
          contactNumber: formData.contactNumber,
          village: formData.village,
          district: formData.district,
          state: formData.state,
          landSize: parseFloat(formData.landSize),
          landUnit: formData.landUnit,
          cropGrown: formData.cropGrown,
          typeOfIrrigation: formData.typeOfIrrigation,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Farmer added successfully!');
        // Reset form
        setFormData({
          farmerId: '',
          fullName: '',
          age: '',
          gender: '',
          contactNumber: '',
          village: '',
          district: '',
          state: '',
          landSize: '',
          landUnit: 'acres',
          cropGrown: '',
          typeOfIrrigation: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // Redirect to CRP dashboard after 2 seconds
        setTimeout(() => {
          navigate('/crp-dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add farmer. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
      console.error('Add farmer error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/crp-dashboard" className="text-gray-500 hover:text-gray-700">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Add New Farmer</h1>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Farmer Registration Form</h2>
            <p className="text-sm text-gray-600 mt-1">Please fill in all the required information about the farmer</p>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mx-6 mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Farmer ID *
                  </label>
                  <input
                    type="text"
                    name="farmerId"
                    value={formData.farmerId}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter unique farmer ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter farmer's full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="18"
                    max="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter contact number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Village *
                  </label>
                  <input
                    type="text"
                    name="village"
                    value={formData.village}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter village name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter district name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter state name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Size *
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="landSize"
                      value={formData.landSize}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      min="0"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2.5"
                    />
                    <select
                      name="landUnit"
                      value={formData.landUnit}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="acres">acres</option>
                      <option value="hectares">hectares</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Agricultural Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2 flex items-center">
                  <Crop className="h-4 w-4 mr-2" />
                  Agricultural Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Crop Grown *
                  </label>
                  <input
                    type="text"
                    name="cropGrown"
                    value={formData.cropGrown}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Rice, Wheat, Vegetables"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Irrigation *
                  </label>
                  <select
                    name="typeOfIrrigation"
                    value={formData.typeOfIrrigation}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select irrigation type</option>
                    <option value="Drip">Drip</option>
                    <option value="Sprinkler">Sprinkler</option>
                    <option value="Flood">Flood</option>
                    <option value="Manual">Manual</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h3 className="text-md font-medium text-gray-900 border-b pb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Account Information
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter password (min 6 characters)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end space-x-4">
              <Link
                to="/crp-dashboard"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Farmer...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Farmer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFarmerForm;