import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Shield, ChevronRight, Leaf, Heart, Globe, Bot, Sparkles, X, Target, Award, Users2, MapPin, Clock, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userData = localStorage.getItem('userData');
    return !!(token && userRole && userData);
  };

  // Handle dashboard access
  const handleDashboardAccess = (role) => {
    if (isAuthenticated()) {
      // User is logged in, check if they have the right role
      const userRole = localStorage.getItem('userRole');
      if (userRole === role) {
        // User has the right role, go to their dashboard
        navigate(`/${role}-dashboard`);
      } else {
        // User has different role, redirect to login to switch
        navigate('/login', { 
          state: { 
            message: `You are currently logged in as ${userRole}. Please log in as ${role} to access this dashboard.` 
          } 
        });
      }
    } else {
      // User is not logged in, go to login page
      navigate('/login', { 
        state: { 
          message: `Please log in as ${role.toUpperCase()} to access the dashboard.` 
        } 
      });
    }
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    const rolesSection = document.getElementById('roles');
    if (rolesSection) {
      rolesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLearnMore = (e) => {
    e.preventDefault();
    setShowLearnMoreModal(true);
  };

  const closeModal = () => {
    setShowLearnMoreModal(false);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-screen bg-transparent">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://i.pinimg.com/736x/d1/42/d8/d142d8b7a2e493ab8e6523ec42a5c420.jpg)'
          }}
        />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <Leaf className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              CENTRE FOR MICROFINANCE
              <br />
              <span className="text-white-400">AND LIVELIHOOD</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white font-semibold mb-8 max-w-2xl mx-auto">
              Empowering rural communities through sustainable agriculture and microfinance solutions
            </p>

            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-bold hover:bg-green-700 rounded-lg text-base transition-all duration-200 group whitespace-nowrap"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <Link
                to="/ai-assistant"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-base font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200 whitespace-nowrap"
              >
                <Bot className="mr-2 h-4 w-4" />
                AI Assistant
                <Sparkles className="ml-2 h-4 w-4" />
              </Link>
              
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-primary-400 text-white rounded-lg text-base font-semibold hover:bg-primary-500 transition-all duration-200 whitespace-nowrap"
              >
                Sign Up
              </Link>
              
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg text-base font-semibold hover:bg-white/20 transition-all duration-200 whitespace-nowrap"
              >
                Log In
              </Link>
              
              <button
                onClick={handleLearnMore}
                className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg text-base font-semibold hover:bg-white/20 transition-all duration-200 whitespace-nowrap"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Transforming Rural Livelihoods
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We work with farmers, communities, and local organizations to create sustainable solutions that improve agricultural productivity and economic opportunities in rural areas.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Agriculture</h3>
              <p className="text-gray-600">
                Promoting eco-friendly farming practices that increase yield while preserving the environment.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">
                Building strong networks of farmers and providing ongoing support for rural development.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-earth-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-earth-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Economic Growth</h3>
              <p className="text-gray-600">
                Creating opportunities for financial inclusion and livelihood improvement in rural areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="roles" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-xl text-gray-600">
              Select your role to access the appropriate dashboard and tools
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <button
              onClick={() => navigate('/login', { state: { message: 'Please log in as CRP to access the dashboard.', preselectRole: 'crp' } })}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-primary-200"
            >
              <div className="p-8 text-center">
                <div className="bg-primary-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-200 transition-colors">
                  <Users className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">CRP</h3>
                <p className="text-gray-600 mb-6">
                  Community Resource Person - Manage farmers, track training attendance, and upload progress reports.
                </p>
                <div className="inline-flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                  Access Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/login', { state: { message: 'Please log in as EXPERT to access the dashboard.', preselectRole: 'expert' } })}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-accent-200"
            >
              <div className="p-8 text-center">
                <div className="bg-accent-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-accent-200 transition-colors">
                  <BookOpen className="h-10 w-10 text-accent-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert</h3>
                <p className="text-gray-600 mb-6">
                  Agricultural Expert - View farmer data, upload advisories, and provide training feedback.
                </p>
                <div className="inline-flex items-center text-accent-600 font-semibold group-hover:text-accent-700">
                  Access Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/login', { state: { message: 'Please log in as SUPERVISOR to access the dashboard.', preselectRole: 'supervisor' } })}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-earth-200"
            >
              <div className="p-8 text-center">
                <div className="bg-earth-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-earth-200 transition-colors">
                  <Shield className="h-10 w-10 text-earth-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Supervisor</h3>
                <p className="text-gray-600 mb-6">
                  Supervisor - Monitor overall performance, manage users, and generate comprehensive reports.
                </p>
                <div className="inline-flex items-center text-earth-600 font-semibold group-hover:text-earth-700">
                  Access Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* AI Assistant Section */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-4">
              <Bot className="h-12 w-12 text-green-600 mr-3" />
              <Sparkles className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Agricultural Assistant
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get instant expert advice on farming, crop management, pest control, and agricultural best practices. 
              Our AI assistant is available 24/7 to help you with your farming queries.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">What Can Our AI Assistant Help You With?</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Crop Management</h4>
                    <p className="text-gray-600">Get advice on planting, harvesting, and crop rotation strategies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Pest & Disease Control</h4>
                    <p className="text-gray-600">Identify and treat common agricultural pests and diseases</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Soil Health</h4>
                    <p className="text-gray-600">Learn about soil testing, fertilization, and improvement techniques</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full p-2 mr-4 mt-1">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sustainable Practices</h4>
                    <p className="text-gray-600">Discover organic farming methods and eco-friendly solutions</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Bot className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Try Our AI Assistant</h3>
              <p className="text-gray-600 mb-6">
                Ask any farming-related question and get instant, expert advice powered by advanced AI technology.
              </p>
              <Link
                to="/ai-assistant"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg text-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all duration-200"
              >
                <Bot className="mr-2 h-5 w-5" />
                Start Chatting
                <Sparkles className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Learn More Modal */}
      {showLearnMoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">About CML</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mission Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Target className="h-6 w-6 text-primary-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Our Mission</h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  The Centre for Microfinance and Livelihood (CML) is dedicated to transforming rural communities through sustainable agricultural practices, financial inclusion, and community empowerment. We believe in creating lasting positive change by addressing the root causes of rural poverty and food insecurity.
                </p>
              </div>

              {/* Core Work Areas */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-accent-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Core Work Areas</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Sustainable Agriculture</h4>
                        <p className="text-sm text-gray-600">Promoting organic farming, water conservation, and climate-smart agricultural practices</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Microfinance Solutions</h4>
                        <p className="text-sm text-gray-600">Providing accessible credit and financial services to rural entrepreneurs</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Capacity Building</h4>
                        <p className="text-sm text-gray-600">Training farmers in modern agricultural techniques and business skills</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Community Development</h4>
                        <p className="text-sm text-gray-600">Building strong local institutions and community networks</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Market Linkages</h4>
                        <p className="text-sm text-gray-600">Connecting farmers to markets and value chains</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900">Technology Integration</h4>
                        <p className="text-sm text-gray-600">Leveraging digital tools for better agricultural outcomes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Target Communities */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Users2 className="h-6 w-6 text-earth-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Target Communities</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-primary-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Geographic Focus</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Rural villages in Haryana, Punjab, and Uttar Pradesh</li>
                      <li>• Semi-arid and drought-prone regions</li>
                      <li>• Areas with limited access to formal financial services</li>
                      <li>• Communities dependent on rain-fed agriculture</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Users2 className="h-5 w-5 text-accent-600 mr-2" />
                      <h4 className="font-medium text-gray-900">Beneficiary Groups</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Small and marginal farmers (0.5-2 hectares)</li>
                      <li>• Women farmers and self-help groups</li>
                      <li>• Landless agricultural laborers</li>
                      <li>• Rural youth seeking livelihood opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Impact & Achievements */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Award className="h-6 w-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Impact & Achievements</h3>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary-600 mb-2">15,000+</div>
                    <div className="text-sm text-gray-600">Farmers Empowered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-600 mb-2">500+</div>
                    <div className="text-sm text-gray-600">Villages Covered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-earth-600 mb-2">₹50M+</div>
                    <div className="text-sm text-gray-600">Microfinance Disbursed</div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-gray-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">Our Journey</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-primary-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-primary-600 font-semibold text-sm">2010</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Foundation</h4>
                      <p className="text-sm text-gray-600">CML established with focus on rural development and microfinance</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-accent-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-accent-600 font-semibold text-sm">2015</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Expansion</h4>
                      <p className="text-sm text-gray-600">Reached 100+ villages and launched agricultural training programs</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-earth-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-earth-600 font-semibold text-sm">2020</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Digital Transformation</h4>
                      <p className="text-sm text-gray-600">Launched digital platform for better farmer engagement and monitoring</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 rounded-full w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">
                      <span className="text-green-600 font-semibold text-sm">2024</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Innovation</h4>
                      <p className="text-sm text-gray-600">Introducing AI-powered advisory and climate-smart solutions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center pt-6 border-t">
                <button
                  onClick={closeModal}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Leaf className="h-8 w-8 text-primary-400 mr-3" />
                <h3 className="text-xl font-bold">Centre for Microfinance and Livelihood</h3>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering rural communities through sustainable agriculture, microfinance solutions, and community development programs.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <p>Email: info@cml.org</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Rural Development Center, India</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Mission</h4>
              <p className="text-gray-400">
                To create sustainable livelihoods and improve the quality of life for rural communities through innovative agricultural and financial solutions.
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Centre for Microfinance and Livelihood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 