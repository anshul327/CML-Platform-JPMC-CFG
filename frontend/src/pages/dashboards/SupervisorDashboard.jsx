import React, { useState } from 'react';
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
  ResponsiveContainer
} from 'recharts';
import {
  Users,
  GraduationCap,
  DollarSign,
  AlertTriangle,
  Download,
  ArrowLeft,
  TrendingUp,
  Settings,
  MessageSquare,
  MapPin,
  Search
} from 'lucide-react';

const SupervisorDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleAlertClick = () => {
    setShowAlert(true);
    // Hide the alert after 3 seconds
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Areas of Assam struggling with agriculture
  const assamAreas = [
    { value: '', label: 'Select an area...' },
    { value: 'dhemaji', label: 'Dhemaji - Flood affected, poor soil fertility' },
    { value: 'lakhimpur', label: 'Lakhimpur - Erosion issues, limited irrigation' },
    { value: 'sonitpur', label: 'Sonitpur - Drought prone, water scarcity' },
    { value: 'udalguri', label: 'Udalguri - Tribal areas, low agricultural productivity' },
    { value: 'baksa', label: 'Baksa - Forest fringe villages, crop damage by wildlife' },
    { value: 'kamrup_rural', label: 'Kamrup Rural - River erosion, displacement' },
    { value: 'nagaon', label: 'Nagaon - Salinity intrusion, poor drainage' },
    { value: 'golaghat', label: 'Golaghat - Tea garden areas, labor shortage' },
    { value: 'jorhat', label: 'Jorhat - Small landholdings, lack of mechanization' },
    { value: 'sivasagar', label: 'Sivasagar - Oil field areas, soil contamination' },
    { value: 'dibrugarh', label: 'Dibrugarh - Tea estates, aging workforce' },
    { value: 'tinsukia', label: 'Tinsukia - Border areas, infrastructure gaps' },
    { value: 'karbi_anglong', label: 'Karbi Anglong - Hilly terrain, poor road connectivity' },
    { value: 'dima_hasao', label: 'Dima Hasao - Landslides, difficult terrain' },
    { value: 'karimganj', label: 'Karimganj - Border district, smuggling issues' },
    { value: 'hailakandi', label: 'Hailakandi - Riverine areas, frequent floods' },
    { value: 'cachar', label: 'Cachar - Barak Valley, communication challenges' }
  ];

  const fundData = [
    { name: 'Agriculture', value: 35, amount: 35000 },
    { name: 'Livestock', value: 25, amount: 25000 },
    { name: 'Microfinance', value: 20, amount: 20000 },
    { name: 'Training', value: 15, amount: 15000 },
    { name: 'Others', value: 5, amount: 5000 },
  ];

  const monthlyData = [
    { month: 'Jan', farmers: 120, trainings: 8, funds: 45000 },
    { month: 'Feb', farmers: 145, trainings: 12, funds: 52000 },
    { month: 'Mar', farmers: 165, trainings: 15, funds: 58000 },
    { month: 'Apr', farmers: 180, trainings: 18, funds: 63000 },
    { month: 'May', farmers: 198, trainings: 22, funds: 68000 },
    { month: 'Jun', farmers: 220, trainings: 25, funds: 75000 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6'];

  const stats = [
    {
      title: 'Total Farmers',
      value: '1,234',
      change: '+12%',
      icon: Users,
      color: 'bg-primary-500',
      trend: 'up'
    },
    {
      title: 'Active Trainings',
      value: '28',
      change: '+8%',
      icon: GraduationCap,
      color: 'bg-accent-500',
      trend: 'up'
    },
    {
      title: 'Funds Utilized',
      value: '₹75,000',
      change: '+15%',
      icon: DollarSign,
      color: 'bg-earth-500',
      trend: 'up'
    },
    {
      title: 'Pending Advisory',
      value: '5',
      change: '-20%',
      icon: AlertTriangle,
      color: 'bg-red-500',
      trend: 'down'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'farmer', message: 'New farmer Rajesh Kumar added by CRP Amit', time: '2 hours ago' },
    { id: 2, type: 'training', message: 'Organic Farming training completed with 85% attendance', time: '4 hours ago' },
    { id: 3, type: 'advisory', message: 'Expert Dr. Sharma published monsoon advisory', time: '1 day ago' },
    { id: 4, type: 'fund', message: '₹25,000 fund allocated for Sonipat district', time: '2 days ago' },
  ];

  // New mock data for regional performance
  const regionalData = [
    { area: 'Dhemaji', farmers: 85, trainings: 5, funds: '₹12,000', issues: 'Flood, poor soil' },
    { area: 'Lakhimpur', farmers: 110, trainings: 7, funds: '₹18,500', issues: 'Erosion, irrigation' },
    { area: 'Sonitpur', farmers: 92, trainings: 6, funds: '₹14,000', issues: 'Drought, water scarcity' },
    { area: 'Udalguri', farmers: 60, trainings: 3, funds: '₹8,000', issues: 'Low productivity' },
    { area: 'Nagaon', farmers: 150, trainings: 10, funds: '₹25,000', issues: 'Salinity intrusion' },
    { area: 'Jorhat', farmers: 75, trainings: 4, funds: '₹10,500', issues: 'Small landholdings' },
  ];

  const trainingStats = [
    { attendees: 512, subject: "Paddy Crops" },
    { attendees: 498, subject: "Organic Farming Techniques" },
    { attendees: 475, subject: "Spice Cultivation" },
    { attendees: 522, subject: "Water Conservation Methods" },
    { attendees: 489, subject: "Pest Management" },
    { attendees: 505, subject: "Paddy Crops" },
    { attendees: 493, subject: "Organic Farming Techniques" },
    { attendees: 510, subject: "Spice Cultivation" },
    { attendees: 478, subject: "Pest Management" },
    { attendees: 519, subject: "Water Conservation Methods" },
    { attendees: 486, subject: "Paddy Crops" },
    { attendees: 95, subject: "Organic Farming Techniques" },
    { attendees: 781, subject: "Spice Cultivation" },
    { attendees: 467, subject: "Pest Management" },
    { attendees: 528, subject: "Water Conservation Methods" },
    { attendees: 800, subject: "Paddy Crops" },
    { attendees: 513, subject: "Organic Farming Techniques" },
    { attendees: 476, subject: "Spice Cultivation" },
    { attendees: 508, subject: "Pest Management" },
    { attendees: 492, subject: "Water Conservation Methods" }
  ];
  
  // Group and sum attendees by subject
  const aggregatedTrainings = trainingStats.reduce((acc, curr) => {
    const existing = acc.find(item => item.subject === curr.subject);
    if (existing) {
      existing.attendees += curr.attendees;
    } else {
      acc.push({ subject: curr.subject, attendees: curr.attendees });
    }
    return acc;
  }, []);


  const subjectColors = {
    "Paddy Crops": "#3B82F6",                 // blue
    "Organic Farming Techniques": "#10B981", // green
    "Spice Cultivation": "#F59E0B",          // yellow
    "Water Conservation Methods": "#8B5CF6", // violet
    "Pest Management": "#EF4444"             // red
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
              <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Alert Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search Bar */}
          <div className="flex-1 w-full">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Area
            </label>
            <div className="relative">
              <select
                id="search"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {assamAreas.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Alert Button */}
          <div className="w-full md:w-auto">
            <button
              onClick={handleAlertClick}
              disabled={!searchQuery || searchQuery === ''}
              title={!searchQuery || searchQuery === '' ? 'Please select an area first' : 'Send alert for selected area'}
              className={`w-full md:w-auto font-medium py-2 px-6 rounded-md transition duration-200 flex items-center justify-center gap-2 ${
                !searchQuery || searchQuery === ''
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
              Alert
            </button>
            {(!searchQuery || searchQuery === '') && (
              <p className="text-xs text-gray-500 mt-1 text-center">Please select an area first</p>
            )}
          </div>
        </div>
      </div>

      {/* Alert Message */}
      {showAlert && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50 animate-fade-in">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium">SMS sent successfully!</span>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-earth-100 text-earth-700 border-r-2 border-earth-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <TrendingUp className="h-5 w-5 mr-3" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'users'
                    ? 'bg-earth-100 text-earth-700 border-r-2 border-earth-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                Manage Users
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'feedback'
                    ? 'bg-earth-100 text-earth-700 border-r-2 border-earth-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                View Feedback
              </button>
              <button
                onClick={() => setActiveTab('regional')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'regional'
                    ? 'bg-earth-100 text-earth-700 border-r-2 border-earth-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MapPin className="h-5 w-5 mr-3" />
                Regional Performance
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-earth-100 text-earth-700 border-r-2 border-earth-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
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

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                {/* Fund Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fund Distribution by Vertical</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={fundData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {fundData.map((entry, index) => (
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
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="farmers" fill="#10B981" name="New Farmers" />
                      <Bar dataKey="trainings" fill="#F59E0B" name="Trainings" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>


   {/* Aggregated Attendance Chart */}
<div className="bg-white rounded-lg shadow p-6">
  <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Attendance by Training Subject</h3>
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={aggregatedTrainings}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="subject" tick={{ fontSize: 11, angle: -30, textAnchor: 'end' }} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="attendees" name="Total Attendees">
        {aggregatedTrainings.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={subjectColors[entry.subject] || "#8884d8"} />
        ))}
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>



              {/* Recent Activities */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className={`rounded-full p-2 ${
                        activity.type === 'farmer' ? 'bg-primary-100' :
                          activity.type === 'training' ? 'bg-accent-100' :
                            activity.type === 'advisory' ? 'bg-blue-100' : 'bg-earth-100'
                      }`}>
                        {activity.type === 'farmer' && <Users className="h-4 w-4 text-primary-600" />}
                        {activity.type === 'training' && <GraduationCap className="h-4 w-4 text-accent-600" />}
                        {activity.type === 'advisory' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'fund' && <DollarSign className="h-4 w-4 text-earth-600" />}
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

          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">User Management</h2>
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Join Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Farmers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Performance
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Amit Kumar</div>
                        <div className="text-sm text-gray-500">amit.kumar@email.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">CRP</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+91 98765 43210</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sonipat</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">15 Jan 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2 hours ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">135</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600 mr-2">4.8</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-earth-600 hover:text-earth-700 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-700">Suspend</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Dr. Priya Sharma</div>
                        <div className="text-sm text-gray-500">priya.sharma@email.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-accent-100 text-accent-800 rounded-full">Expert</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+91 98765 43211</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sonipat</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10 Dec 2023</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 day ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">534</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600 mr-2">4.9</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-earth-600 hover:text-earth-700 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-700">Suspend</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Rajesh Patel</div>
                        <div className="text-sm text-gray-500">rajesh.patel@email.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">CRP</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+91 98765 43212</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gurgaon</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20 Feb 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3 days ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">98</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-yellow-600 mr-2">3.8</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < 3 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">Pending</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-earth-600 hover:text-earth-700 mr-2">Edit</button>
                        <button className="text-green-600 hover:text-green-700">Approve</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Dr. Sunita Devi</div>
                        <div className="text-sm text-gray-500">sunita.devi@email.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-accent-100 text-accent-800 rounded-full">Expert</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+91 98765 43213</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Faridabad</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">05 Jan 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1 week ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">267</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600 mr-2">4.6</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">Suspended</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-earth-600 hover:text-earth-700 mr-2">Edit</button>
                        <button className="text-green-600 hover:text-green-700">Activate</button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">Mohan Singh</div>
                        <div className="text-sm text-gray-500">mohan.singh@email.com</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-primary-100 text-primary-800 rounded-full">CRP</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+91 98765 43214</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Rohtak</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12 Mar 2024</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5 hours ago</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">76</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-green-600 mr-2">4.2</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">Active</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button className="text-earth-600 hover:text-earth-700 mr-2">Edit</button>
                        <button className="text-red-600 hover:text-red-700">Suspend</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Feedback Overview</h2>
              <div className="grid gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Training Feedback Summary</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">4.5</p>
                      <p className="text-sm text-gray-600">Average Rating</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">152</p>
                      <p className="text-sm text-gray-600">Total Responses</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-accent-600">89%</p>
                      <p className="text-sm text-gray-600">Satisfaction Rate</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'regional' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Regional Performance</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionalData.map((data, index) => (
                  <div key={index} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-2 flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      {data.area}
                    </h3>
                    <p className="text-sm text-gray-600">
                      *Farmers Enrolled:* <span className="font-semibold text-primary-600">{data.farmers}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      *Trainings Conducted:* <span className="font-semibold text-accent-600">{data.trainings}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      *Funds Utilized:* <span className="font-semibold text-earth-600">{data.funds}</span>
                    </p>
                    {data.issues && (
                      <p className="text-sm text-red-600 mt-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        *Key Issues:* {data.issues}
                      </p>
                    )}
                  </div>
                ))}
                {/* Example of a card for an area not explicitly in regionalData but available in assamAreas */}
                {searchQuery && searchQuery !== '' && !regionalData.some(d => d.area.toLowerCase() === assamAreas.find(a => a.value === searchQuery)?.label.split(' - ')[0].toLowerCase()) && (
                  <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 text-center flex flex-col items-center justify-center">
                    <p className="text-lg text-gray-500 mb-2">No detailed data for {assamAreas.find(a => a.value === searchQuery)?.label.split(' - ')[0]}</p>
                    <p className="text-sm text-gray-400">This area might be new or data is yet to be populated.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-700">Manage your dashboard settings here. (Content to be added)</p>
                {/* Add settings options like notifications, permissions, etc. */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;