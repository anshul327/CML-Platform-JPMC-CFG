import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Papa from 'papaparse';
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
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  UserPlus, 
  GraduationCap, 
  MessageSquare, 
  Filter, 
  Plus,
  Search,
  MoreVertical,
  ArrowLeft,
  Upload,
  X,
  FileText,
  AlertCircle,
  Calendar,
  Crop,
  CheckCircle,
  TrendingUp,
  Eye,
  Clock
} from 'lucide-react';

const CRPDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAdvisoryModal, setShowAdvisoryModal] = useState(false);
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [csvError, setCsvError] = useState('');
  const [uploadedReports, setUploadedReports] = useState([]);

  const farmers = [
    { id: 1, name: 'Rajesh Kumar', village: 'Kharkhoda', district: 'Sonipat', status: 'active', crop: 'Wheat', landSize: '2.5 acres' },
    { id: 2, name: 'Priya Sharma', village: 'Bahalgarh', district: 'Sonipat', status: 'training', crop: 'Rice', landSize: '1.8 acres' },
    { id: 3, name: 'Amit Singh', village: 'Kundli', district: 'Sonipat', status: 'pending', crop: 'Vegetables', landSize: '3.2 acres' },
    { id: 4, name: 'Sunita Devi', village: 'Mundlana', district: 'Sonipat', status: 'active', crop: 'Cotton', landSize: '2.0 acres' },
    { id: 5, name: 'Ramesh Patel', village: 'Gohana', district: 'Sonipat', status: 'active', crop: 'Sugarcane', landSize: '4.1 acres' },
    { id: 6, name: 'Lakshmi Devi', village: 'Kharkhoda', district: 'Sonipat', status: 'training', crop: 'Pulses', landSize: '1.5 acres' },
  ];

  const trainings = [
    { id: 1, title: 'Organic Farming Techniques', date: '2024-02-15', attendance: 85, totalFarmers: 100 },
    { id: 2, title: 'Water Conservation Methods', date: '2024-02-10', attendance: 92, totalFarmers: 110 },
    { id: 3, title: 'Pest Management', date: '2024-02-05', attendance: 78, totalFarmers: 95 },
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
      adviceDate: '2024-02-20',
      content: 'With the monsoon season approaching, farmers should prepare their fields by ensuring proper drainage systems. Clear all water channels and repair any damaged bunds. Apply organic matter to improve soil structure and water retention. Consider early sowing of short-duration crops that can be harvested before heavy rains. Monitor weather forecasts regularly and be prepared for potential flooding in low-lying areas.',
      expert: 'Dr. Rajesh Kumar',
      contact: '+91 98765 43210'
    },
    { 
      id: 2, 
      title: 'Seed Selection for Kharif Season', 
      date: '2024-02-18', 
      priority: 'medium', 
      read: true,
      cropType: 'Rice, Maize, Pulses',
      severity: 'Important',
      adviceDate: '2024-02-18',
      content: 'For the upcoming Kharif season, select certified seeds that are disease-resistant and suitable for your soil type. Rice varieties like IR64 and Swarna are recommended for this region. For maize, choose hybrid varieties that have shown good performance in previous seasons. Ensure proper seed treatment before sowing to prevent fungal infections. Store seeds in a cool, dry place until sowing time.',
      expert: 'Dr. Priya Sharma',
      contact: '+91 98765 43211'
    },
    { 
      id: 3, 
      title: 'Fertilizer Application Schedule', 
      date: '2024-02-15', 
      priority: 'low', 
      read: false,
      cropType: 'Wheat, Vegetables',
      severity: 'Normal',
      adviceDate: '2024-02-15',
      content: 'Follow the recommended fertilizer application schedule based on soil test results. For wheat, apply NPK in the ratio 120:60:40 kg/ha. Split application is recommended with 50% at sowing and 50% at first irrigation. For vegetables, use organic fertilizers like vermicompost along with chemical fertilizers. Avoid over-fertilization as it can lead to environmental pollution and crop damage.',
      expert: 'Dr. Amit Singh',
      contact: '+91 98765 43212'
    },
    { 
      id: 4, 
      title: 'Drought Management Strategies', 
      date: '2024-02-12', 
      priority: 'high', 
      read: false,
      cropType: 'All Crops',
      severity: 'Critical',
      adviceDate: '2024-02-12',
      content: 'Due to delayed monsoon and water scarcity, implement drought management strategies immediately. Use mulching to reduce soil moisture loss. Consider drip irrigation for water-intensive crops. Switch to drought-resistant crop varieties where possible. Implement crop rotation with legumes to improve soil fertility. Store harvested rainwater in farm ponds for emergency use.',
      expert: 'Dr. Sunita Devi',
      contact: '+91 98765 43213'
    },
  ];

  // Dashboard Data
  const cropDistribution = [
    { name: 'Wheat', value: 35, farmers: 42 },
    { name: 'Rice', value: 25, farmers: 30 },
    { name: 'Vegetables', value: 20, farmers: 24 },
    { name: 'Cotton', value: 15, farmers: 18 },
    { name: 'Others', value: 5, farmers: 6 },
  ];

  const monthlyProgress = [
    { month: 'Jan', farmers: 85, trainings: 3, attendance: 92 },
    { month: 'Feb', farmers: 95, trainings: 4, attendance: 88 },
    { month: 'Mar', farmers: 105, trainings: 5, attendance: 95 },
    { month: 'Apr', farmers: 115, trainings: 6, attendance: 91 },
    { month: 'May', farmers: 125, trainings: 7, attendance: 89 },
    { month: 'Jun', farmers: 135, trainings: 8, attendance: 94 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

  const stats = [
    { 
      title: 'Farmers Enrolled', 
      value: '135', 
      change: '+12%', 
      icon: Users, 
      color: 'bg-primary-500',
      trend: 'up'
    },
    { 
      title: 'Active Trainings', 
      value: '8', 
      change: '+25%', 
      icon: GraduationCap, 
      color: 'bg-accent-500',
      trend: 'up'
    },
    { 
      title: 'Avg. Attendance', 
      value: '94%', 
      change: '+3%', 
      icon: TrendingUp, 
      color: 'bg-green-500',
      trend: 'up'
    },
    { 
      title: 'Pending Reports', 
      value: '3', 
      change: '-40%', 
      icon: FileText, 
      color: 'bg-orange-500',
      trend: 'down'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'farmer', message: 'New farmer Lakshmi Devi enrolled', time: '2 hours ago' },
    { id: 2, type: 'training', message: 'Organic Farming training completed with 85% attendance', time: '4 hours ago' },
    { id: 3, type: 'advisory', message: 'Received monsoon preparation advisory', time: '1 day ago' },
    { id: 4, type: 'report', message: 'Monthly progress report uploaded', time: '2 days ago' },
  ];

  // Filter farmers based on search term
  const filteredFarmers = useMemo(() => {
    if (!searchTerm.trim()) return farmers;
    
    const searchLower = searchTerm.toLowerCase();
    return farmers.filter(farmer => 
      farmer.name.toLowerCase().includes(searchLower) ||
      farmer.village.toLowerCase().includes(searchLower) ||
      farmer.district.toLowerCase().includes(searchLower) ||
      farmer.crop.toLowerCase().includes(searchLower) ||
      farmer.status.toLowerCase().includes(searchLower)
    );
  }, [farmers, searchTerm]);

  // Highlight search terms in text
  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'training': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
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
      case 'Important': return 'bg-orange-100 text-orange-800';
      case 'Normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // CSV Upload Handler
  const handleCsvUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setCsvError('Please upload a valid CSV file');
      return;
    }

    setCsvError('');
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setCsvError('Error parsing CSV file. Please check the format.');
          return;
        }
        setCsvData(results.data);
        console.log('Parsed CSV data:', results.data);
      },
      error: (error) => {
        setCsvError('Error reading CSV file: ' + error.message);
      }
    });
  };

  // Report Upload Handler
  const handleReportUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const newReport = {
      id: Date.now(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      uploadDate: new Date().toLocaleDateString(),
      status: 'Uploaded'
    };

    setUploadedReports(prev => [...prev, newReport]);
  };

  // Advisory Modal Handlers
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
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">CRP Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/add-farmer"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Farmer
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('farmers')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'farmers'
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                My Farmers
              </button>
              <button
                onClick={() => setActiveTab('training')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'training'
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <GraduationCap className="h-5 w-5 mr-3" />
                Training Attendance
              </button>
              <button
                onClick={() => setActiveTab('advisories')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'advisories'
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Received Advisories
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'reports'
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="h-5 w-5 mr-3" />
                Upload Reports
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {activeTab === 'overview' && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className={`text-sm flex items-center ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stat.change} from last month
                        </p>
                      </div>
                      <div className={`${stat.color} rounded-full p-3`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Crop Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Crop Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={cropDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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

                {/* Monthly Progress */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="farmers" fill="#10B981" name="Farmers" />
                      <Bar dataKey="trainings" fill="#F59E0B" name="Trainings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`rounded-full p-2 ${
                        activity.type === 'farmer' ? 'bg-primary-100' :
                        activity.type === 'training' ? 'bg-accent-100' :
                        activity.type === 'advisory' ? 'bg-blue-100' :
                        'bg-orange-100'
                      }`}>
                        {activity.type === 'farmer' && <Users className="h-4 w-4 text-primary-600" />}
                        {activity.type === 'training' && <GraduationCap className="h-4 w-4 text-accent-600" />}
                        {activity.type === 'advisory' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'report' && <FileText className="h-4 w-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'farmers' && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">My Farmers</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search farmers by name, village, crop, or status..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
                {searchTerm && (
                  <div className="mt-2 text-sm text-gray-600">
                    Found {filteredFarmers.length} farmer(s) matching "{searchTerm}"
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Farmer Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Crop & Land
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFarmers.map((farmer) => (
                      <tr key={farmer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {highlightText(farmer.name, searchTerm)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {highlightText(farmer.village, searchTerm)}
                          </div>
                          <div className="text-sm text-gray-500">
                            {highlightText(farmer.district, searchTerm)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {highlightText(farmer.crop, searchTerm)}
                          </div>
                          <div className="text-sm text-gray-500">{farmer.landSize}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(farmer.status)}`}>
                            {highlightText(farmer.status, searchTerm)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* CSV Upload Section */}
              <div className="mt-8 bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Add Farmers (CSV Upload)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload CSV File
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <label htmlFor="csv-upload" className="cursor-pointer">
                        <p className="text-sm text-gray-600">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Only CSV files accepted
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  {csvError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-sm text-red-700">{csvError}</span>
                      </div>
                    </div>
                  )}

                  {csvData && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                          <span className="text-sm text-green-700">
                            Successfully parsed {csvData.length} records
                          </span>
                        </div>
                        <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                          Process Data
                        </button>
                      </div>
                      <div className="mt-3 max-h-40 overflow-y-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b">
                              {Object.keys(csvData[0] || {}).map(key => (
                                <th key={key} className="text-left py-1">{key}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {csvData.slice(0, 5).map((row, index) => (
                              <tr key={index} className="border-b">
                                {Object.values(row).map((value, i) => (
                                  <td key={i} className="py-1">{String(value)}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {csvData.length > 5 && (
                          <p className="text-xs text-gray-500 mt-2">
                            Showing first 5 rows of {csvData.length} total records
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Training Attendance</h2>
              <div className="grid gap-4">
                {trainings.map((training) => (
                  <div key={training.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                      <span className="text-sm text-gray-500">{training.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-600">
                          Attendance: <span className="font-medium">{training.attendance}/{training.totalFarmers}</span>
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${(training.attendance / training.totalFarmers) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-primary-600">
                          {Math.round((training.attendance / training.totalFarmers) * 100)}%
                        </span>
                      </div>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'advisories' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Received Advisories</h2>
              <div className="space-y-4">
                {advisories.map((advisory) => (
                  <div key={advisory.id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                    advisory.priority === 'high' ? 'border-red-500' : 
                    advisory.priority === 'medium' ? 'border-yellow-500' : 'border-green-500'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{advisory.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Crop className="h-4 w-4 mr-1" />
                            {advisory.cropType}
                          </div>
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(advisory.severity)}`}>
                              {advisory.severity}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {advisory.adviceDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(advisory.priority)}`}>
                          {advisory.priority}
                        </span>
                        {!advisory.read && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Received: {advisory.date}</span>
                      <button 
                        onClick={() => openAdvisoryModal(advisory)}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Feedback & Progress Reports</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Upload Form */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Report</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                        <option>Monthly Progress Report</option>
                        <option>Training Feedback</option>
                        <option>Farmer Feedback</option>
                        <option>Field Visit Report</option>
                        <option>CSV Data Report</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Description
                      </label>
                      <textarea 
                        rows={4} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe the report content..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload File
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png"
                          onChange={handleReportUpload}
                          className="hidden"
                          id="report-upload"
                        />
                        <label htmlFor="report-upload" className="cursor-pointer">
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PDF, DOC, CSV, or image files up to 10MB
                          </p>
                        </label>
                      </div>
                    </div>
                    
                    <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                      Upload Report
                    </button>
                  </div>
                </div>

                {/* Uploaded Reports List */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
                  <div className="space-y-3">
                    {uploadedReports.length === 0 ? (
                      <p className="text-gray-500 text-sm">No reports uploaded yet</p>
                    ) : (
                      uploadedReports.map((report) => (
                        <div key={report.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{report.name}</p>
                              <p className="text-xs text-gray-500">{report.size} • {report.uploadDate}</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 font-medium">{report.status}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Advisory Modal */}
      {showAdvisoryModal && selectedAdvisory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedAdvisory.title}</h2>
                <button
                  onClick={closeAdvisoryModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Advisory Metadata */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Advisory Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(selectedAdvisory.priority)}`}>
                          {selectedAdvisory.priority}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Severity:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(selectedAdvisory.severity)}`}>
                          {selectedAdvisory.severity}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Crop Type:</span>
                        <span className="font-medium">{selectedAdvisory.cropType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Advice Date:</span>
                        <span className="font-medium">{selectedAdvisory.adviceDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Expert Contact</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expert:</span>
                        <span className="font-medium">{selectedAdvisory.expert}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium">{selectedAdvisory.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Received:</span>
                        <span className="font-medium">{selectedAdvisory.date}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advisory Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Advisory Content</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {selectedAdvisory.content}
                    </p>
                  </div>
                </div>

                <div className="text-center pt-6 border-t">
                  <button
                    onClick={closeAdvisoryModal}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRPDashboard;