import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  Leaf, 
  LogOut, 
  User, 
  Settings, 
  Bell, 
  BarChart3, 
  Calendar,
  Crop,
  Droplets,
  TrendingUp,
  FileText,
  MessageSquare,
  BookOpen,
  Shield,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bot,
  Sparkles,
  X
} from 'lucide-react';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);

  const userDataString = localStorage.getItem('userData');
  console.log('User data string:', userDataString);
  
  let userData = {};
  try {
    userData = JSON.parse(userDataString || '{}');
    console.log('Parsed user data:', userData);
  } catch (error) {
    console.error('Error parsing user data:', error);
    userData = {};
  }

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  // Sample data for farmer dashboard
  const crops = [
    { id: 1, name: 'Wheat', status: 'growing', plantedDate: '2024-01-15', expectedHarvest: '2024-04-15', area: '2.5 acres', health: 'good' },
    { id: 2, name: 'Rice', status: 'planning', plantedDate: '2024-06-01', expectedHarvest: '2024-09-15', area: '1.8 acres', health: 'pending' },
    { id: 3, name: 'Vegetables', status: 'harvested', plantedDate: '2023-10-01', expectedHarvest: '2024-01-15', area: '0.5 acres', health: 'completed' },
  ];

  const advisories = [
    { 
      id: 1, 
      title: 'Monsoon Preparation Guidelines', 
      date: '2024-02-20', 
      priority: 'high', 
      read: false,
      cropType: 'All Crops',
      severity: 'Critical',
      content: 'With the monsoon season approaching, prepare your fields by ensuring proper drainage systems. Clear all water channels and repair any damaged bunds. Apply organic matter to improve soil structure and water retention.',
      expert: 'Dr. Rajesh Kumar',
      contact: '+91 98765 43210'
    },
    { 
      id: 2, 
      title: 'Wheat Crop Management', 
      date: '2024-02-18', 
      priority: 'medium', 
      read: true,
      cropType: 'Wheat',
      severity: 'Important',
      content: 'Your wheat crop is in the vegetative stage. Apply nitrogen fertilizer at the rate of 60 kg/ha. Monitor for any signs of yellow rust and take preventive measures.',
      expert: 'Dr. Priya Sharma',
      contact: '+91 98765 43211'
    },
    { 
      id: 3, 
      title: 'Water Conservation Tips', 
      date: '2024-02-15', 
      priority: 'low', 
      read: false,
      cropType: 'All Crops',
      severity: 'Normal',
      content: 'Implement mulching to reduce soil moisture loss. Consider drip irrigation for water-intensive crops. Store harvested rainwater in farm ponds.',
      expert: 'Dr. Amit Singh',
      contact: '+91 98765 43212'
    },
  ];

  const trainings = [
    { id: 1, title: 'Organic Farming Techniques', date: '2024-02-15', status: 'completed', attendance: 'Present' },
    { id: 2, title: 'Water Conservation Methods', date: '2024-02-10', status: 'completed', attendance: 'Present' },
    { id: 3, title: 'Pest Management', date: '2024-02-05', status: 'completed', attendance: 'Present' },
    { id: 4, title: 'Modern Irrigation Systems', date: '2024-03-01', status: 'upcoming', attendance: 'Registered' },
  ];

  // Dashboard Data
  const cropYieldData = [
    { month: 'Jan', wheat: 2.5, rice: 0, vegetables: 0.8 },
    { month: 'Feb', wheat: 2.8, rice: 0, vegetables: 0 },
    { month: 'Mar', wheat: 3.2, rice: 0, vegetables: 0 },
    { month: 'Apr', wheat: 3.5, rice: 0, vegetables: 0 },
    { month: 'May', wheat: 0, rice: 0, vegetables: 0 },
    { month: 'Jun', wheat: 0, rice: 0, vegetables: 0 },
    { month: 'Jul', wheat: 0, rice: 0, vegetables: 0 },
    { month: 'Aug', wheat: 0, rice: 2.1, vegetables: 0 },
    { month: 'Sep', wheat: 0, rice: 2.8, vegetables: 0 },
    { month: 'Oct', wheat: 0, rice: 0, vegetables: 1.2 },
    { month: 'Nov', wheat: 0, rice: 0, vegetables: 1.5 },
    { month: 'Dec', wheat: 0, rice: 0, vegetables: 1.8 },
  ];

  const cropDistribution = [
    { name: 'Wheat', value: 40, area: '2.5 acres' },
    { name: 'Rice', value: 35, area: '1.8 acres' },
    { name: 'Vegetables', value: 15, area: '0.5 acres' },
    { name: 'Pulses', value: 10, area: '0.3 acres' },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const stats = [
    { 
      title: 'Total Land Area', 
      value: '5.1 acres', 
      change: '+0.5 acres', 
      icon: Crop, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Active Crops', 
      value: '2', 
      change: '+1', 
      icon: Leaf, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Training Completed', 
      value: '3', 
      change: '+2', 
      icon: BookOpen, 
      color: 'bg-purple-500',
      trend: 'up'
    },
    { 
      title: 'Unread Advisories', 
      value: '2', 
      change: '-1', 
      icon: Bell, 
      color: 'bg-orange-500',
      trend: 'down'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'crop', message: 'Wheat crop entered flowering stage', time: '2 hours ago' },
    { id: 2, type: 'training', message: 'Completed Organic Farming training', time: '4 hours ago' },
    { id: 3, type: 'advisory', message: 'Received monsoon preparation advisory', time: '1 day ago' },
    { id: 4, type: 'harvest', message: 'Vegetable harvest completed', time: '2 days ago' },
  ];

  // Filter crops based on search term
  const filteredCrops = useMemo(() => {
    if (!searchTerm.trim()) return crops;
    
    const searchLower = searchTerm.toLowerCase();
    return crops.filter(crop => 
      crop.name.toLowerCase().includes(searchLower) ||
      crop.status.toLowerCase().includes(searchLower) ||
      crop.health.toLowerCase().includes(searchLower)
    );
  }, [crops, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'growing': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'harvested': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'Important': return 'bg-yellow-100 text-yellow-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openAdvisoryModal = (advisory) => {
    setSelectedAdvisory(advisory);
    setShowAdvisoryModal(true);
  };

  const closeAdvisoryModal = () => {
    setShowAdvisoryModal(false);
    setSelectedAdvisory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Farmer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Bell className="h-6 w-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Settings className="h-6 w-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3 mr-4">
                <User className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back, {userData.fullName || userData.name || 'Farmer'}!
                </h2>
                <p className="text-gray-600">
                  Manage your crops, access AI assistance, and stay updated with agricultural advisories.
                </p>
              </div>
            </div>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              <Bot className="mr-2 h-4 w-4" />
              Ask AI Assistant
              <Sparkles className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: BarChart3 },
                { id: 'crops', name: 'My Crops', icon: Crop },
                { id: 'advisories', name: 'Advisories', icon: Bell },
                { id: 'trainings', name: 'Trainings', icon: BookOpen },
                { id: 'activities', name: 'Activities', icon: Clock }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Crop Yield Chart */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Yield Trends</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={cropYieldData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="wheat" stroke="#10B981" strokeWidth={2} />
                        <Line type="monotone" dataKey="rice" stroke="#3B82F6" strokeWidth={2} />
                        <Line type="monotone" dataKey="vegetables" stroke="#F59E0B" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Crop Distribution */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={cropDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {cropDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <Clock className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                          <p className="text-xs text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Crops Tab */}
            {activeTab === 'crops' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Crops</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search crops..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                    <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Crop
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Planted Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Harvest</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Health</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCrops.map((crop) => (
                        <tr key={crop.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Crop className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-sm font-medium text-gray-900">{crop.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(crop.status)}`}>
                              {crop.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{crop.plantedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{crop.expectedHarvest}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{crop.area}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              crop.health === 'good' ? 'bg-green-100 text-green-800' : 
                              crop.health === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {crop.health}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900">
                              <FileText className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Advisories Tab */}
            {activeTab === 'advisories' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Agricultural Advisories</h3>
                <div className="space-y-4">
                  {advisories.map((advisory) => (
                    <div key={advisory.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{advisory.title}</h4>
                            {!advisory.read && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                New
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {advisory.date}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(advisory.priority)}`}>
                              {advisory.priority} priority
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(advisory.severity)}`}>
                              {advisory.severity}
                            </span>
                            <span className="flex items-center">
                              <Crop className="h-4 w-4 mr-1" />
                              {advisory.cropType}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3 line-clamp-2">{advisory.content}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Expert:</span> {advisory.expert} | {advisory.contact}
                            </div>
                            <button
                              onClick={() => openAdvisoryModal(advisory)}
                              className="text-green-600 hover:text-green-800 font-medium text-sm"
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trainings Tab */}
            {activeTab === 'trainings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Training Programs</h3>
                <div className="space-y-4">
                  {trainings.map((training) => (
                    <div key={training.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900 mb-2">{training.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {training.date}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              training.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {training.status}
                            </span>
                            <span className="flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {training.attendance}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <FileText className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-800">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="bg-green-100 rounded-full p-2 mr-4">
                        <Clock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Advisory Modal */}
      {showAdvisoryModal && selectedAdvisory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">{selectedAdvisory.title}</h3>
                <button
                  onClick={closeAdvisoryModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {selectedAdvisory.date}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedAdvisory.priority)}`}>
                    {selectedAdvisory.priority} priority
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedAdvisory.severity)}`}>
                    {selectedAdvisory.severity}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Crop Type</h4>
                  <p className="text-gray-700">{selectedAdvisory.cropType}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Advisory Content</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedAdvisory.content}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Expert Contact</h4>
                  <p className="text-gray-700">{selectedAdvisory.expert}</p>
                  <p className="text-gray-700">{selectedAdvisory.contact}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeAdvisoryModal}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard; 