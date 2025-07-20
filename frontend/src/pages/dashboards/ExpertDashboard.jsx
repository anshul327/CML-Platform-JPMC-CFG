import React, { useState } from 'react';
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
  Database, 
  Upload, 
  MessageSquare, 
  Lightbulb,
  Search,
  Filter,
  ArrowLeft,
  FileText,
  AlertCircle,
  Calendar,
  CheckCircle,
  X,
  TrendingUp,
  Eye,
  Clock,
  Users,
  GraduationCap
} from 'lucide-react';

const ExpertDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [csvData, setCsvData] = useState(null);
  const [csvError, setCsvError] = useState('');
  const [attachedFile, setAttachedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadedAdvisory, setUploadedAdvisory] = useState(null);
  const [advisoryForm, setAdvisoryForm] = useState({
    title: '',
    targetAudience: 'All Farmers',
    urgencyLevel: 'Medium',
    tags: '',
    content: ''
  });

  const farmers = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      village: 'Kharkhoda', 
      district: 'Sonipat', 
      crop: 'Wheat', 
      landSize: '2.5 acres',
      lastVisit: '2024-02-15',
      issues: ['Pest infestation', 'Irrigation problems']
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      village: 'Bahalgarh', 
      district: 'Sonipat', 
      crop: 'Rice', 
      landSize: '1.8 acres',
      lastVisit: '2024-02-12',
      issues: ['Nutrient deficiency']
    },
    { 
      id: 3, 
      name: 'Amit Singh', 
      village: 'Kundli', 
      district: 'Sonipat', 
      crop: 'Vegetables', 
      landSize: '3.2 acres',
      lastVisit: '2024-02-10',
      issues: ['Market access', 'Seed quality']
    },
  ];

  const advisories = [
    { id: 1, title: 'Monsoon Preparation Guidelines', date: '2024-02-20', tags: ['Monsoon', 'Preparation'], urgency: 'High' },
    { id: 2, title: 'Seed Selection for Kharif Season', date: '2024-02-18', tags: ['Seeds', 'Kharif'], urgency: 'Medium' },
    { id: 3, title: 'Organic Pest Control Methods', date: '2024-02-15', tags: ['Organic', 'Pest Control'], urgency: 'Low' },
  ];

  const trainings = [
    { id: 1, title: 'Organic Farming Techniques', date: '2024-02-25', participants: 45, feedback: 'Excellent' },
    { id: 2, title: 'Water Conservation Methods', date: '2024-02-22', participants: 38, feedback: 'Good' },
    { id: 3, title: 'Integrated Pest Management', date: '2024-02-20', participants: 52, feedback: 'Very Good' },
  ];

  // Dashboard Data
  const farmerReviewData = [
    { month: 'Jan', reviewed: 85, pending: 15, total: 100 },
    { month: 'Feb', reviewed: 92, pending: 8, total: 100 },
    { month: 'Mar', reviewed: 78, pending: 22, total: 100 },
    { month: 'Apr', reviewed: 95, pending: 5, total: 100 },
    { month: 'May', reviewed: 88, pending: 12, total: 100 },
    { month: 'Jun', reviewed: 96, pending: 4, total: 100 },
  ];

  const suggestionStatus = [
    { name: 'Implemented', value: 45, count: 18 },
    { name: 'Under Review', value: 30, count: 12 },
    { name: 'Pending', value: 20, count: 8 },
    { name: 'Rejected', value: 5, count: 2 },
  ];

  const COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const stats = [
    { 
      title: 'Farmers Reviewed', 
      value: '534', 
      change: '+15%', 
      icon: Eye, 
      color: 'bg-accent-500',
      trend: 'up'
    },
    { 
      title: 'Pending Suggestions', 
      value: '8', 
      change: '-25%', 
      icon: Lightbulb, 
      color: 'bg-yellow-500',
      trend: 'down'
    },
    { 
      title: 'Advisories Published', 
      value: '24', 
      change: '+20%', 
      icon: MessageSquare, 
      color: 'bg-blue-500',
      trend: 'up'
    },
    { 
      title: 'Training Sessions', 
      value: '12', 
      change: '+8%', 
      icon: GraduationCap, 
      color: 'bg-green-500',
      trend: 'up'
    },
  ];

  const recentActivities = [
    { id: 1, type: 'review', message: 'Reviewed 15 farmer profiles from Kharkhoda village', time: '2 hours ago' },
    { id: 2, type: 'advisory', message: 'Published monsoon preparation advisory', time: '4 hours ago' },
    { id: 3, type: 'training', message: 'Conducted Organic Farming training with 45 participants', time: '1 day ago' },
    { id: 4, type: 'suggestion', message: 'New suggestion submitted for platform improvement', time: '2 days ago' },
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
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

  // File Attachment Handler
  const handleFileAttachment = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAttachedFile({
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        type: file.type
      });
    }
  };

  // Remove attached file
  const removeAttachedFile = () => {
    setAttachedFile(null);
  };

  // Handle advisory form changes
  const handleAdvisoryFormChange = (e) => {
    const { name, value } = e.target;
    setAdvisoryForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle advisory form submission
  const handleAdvisorySubmit = (e) => {
    e.preventDefault();
    console.log('Advisory form submitted:', advisoryForm);
    console.log('Attached file:', attachedFile);
    console.log('CSV data:', csvData);
    
    // Reset form
    setAdvisoryForm({
      title: '',
      targetAudience: 'All Farmers',
      urgencyLevel: 'Medium',
      tags: '',
      content: ''
    });
    setAttachedFile(null);
    setCsvData(null);
    setCsvError('');
  };

  // Quick Upload Advisory Handler
  const handleQuickAdvisoryUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if it's a supported advisory file format
    const supportedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/csv',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];

    if (!supportedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
      alert('Please upload a valid file format (PDF, DOC, DOCX, CSV, or image)');
      return;
    }

    setUploadedAdvisory({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.type,
      uploadDate: new Date().toLocaleDateString()
    });

    // If it's a CSV file, parse it
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            alert('Error parsing CSV file. Please check the format.');
            return;
          }
          setCsvData(results.data);
          console.log('Parsed CSV data:', results.data);
        },
        error: (error) => {
          alert('Error reading CSV file: ' + error.message);
        }
      });
    }

    // Close modal after successful upload
    setTimeout(() => {
      setShowUploadModal(false);
    }, 2000);
  };

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadedAdvisory(null);
    setCsvData(null);
    setCsvError('');
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
              <h1 className="text-2xl font-bold text-gray-900">Expert Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Advisory
              </button>
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
                    ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
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
                    ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Database className="h-5 w-5 mr-3" />
                View Farmer Data
              </button>
              <button
                onClick={() => setActiveTab('advisory')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'advisory'
                    ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Upload className="h-5 w-5 mr-3" />
                Upload Advisory
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'feedback'
                    ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                Training Feedback
              </button>
              <button
                onClick={() => setActiveTab('suggestions')}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  activeTab === 'suggestions'
                    ? 'bg-accent-100 text-accent-700 border-r-2 border-accent-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Lightbulb className="h-5 w-5 mr-3" />
                Add Suggestion
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
                {/* Farmer Review Progress */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Farmer Review Progress</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={farmerReviewData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="reviewed" fill="#10B981" name="Reviewed" />
                      <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Suggestion Status */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggestion Status</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={suggestionStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {suggestionStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
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
                        activity.type === 'review' ? 'bg-accent-100' :
                        activity.type === 'advisory' ? 'bg-blue-100' :
                        activity.type === 'training' ? 'bg-green-100' :
                        'bg-yellow-100'
                      }`}>
                        {activity.type === 'review' && <Eye className="h-4 w-4 text-accent-600" />}
                        {activity.type === 'advisory' && <MessageSquare className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'training' && <GraduationCap className="h-4 w-4 text-green-600" />}
                        {activity.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-yellow-600" />}
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
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Farmer Data</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search farmers..."
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {farmers.map((farmer) => (
                  <div key={farmer.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{farmer.name}</h3>
                        <p className="text-sm text-gray-600">{farmer.village}, {farmer.district}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Last Visit</p>
                        <p className="text-sm font-medium">{farmer.lastVisit}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Primary Crop</p>
                        <p className="font-medium">{farmer.crop}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Land Size</p>
                        <p className="font-medium">{farmer.landSize}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Current Issues</p>
                      <div className="flex flex-wrap gap-2">
                        {farmer.issues.map((issue, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            {issue}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors">
                        Send Advisory
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'advisory' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Upload Advisory</h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Advisory Form */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Advisory</h3>
                  
                  <form onSubmit={handleAdvisorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advisory Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={advisoryForm.title}
                        onChange={handleAdvisoryFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        placeholder="Enter advisory title..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select 
                        name="targetAudience"
                        value={advisoryForm.targetAudience}
                        onChange={handleAdvisoryFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      >
                        <option>All Farmers</option>
                        <option>Wheat Farmers</option>
                        <option>Rice Farmers</option>
                        <option>Vegetable Farmers</option>
                        <option>Organic Farmers</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <select 
                        name="urgencyLevel"
                        value={advisoryForm.urgencyLevel}
                        onChange={handleAdvisoryFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={advisoryForm.tags}
                        onChange={handleAdvisoryFormChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        placeholder="e.g., monsoon, seeds, irrigation"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Advisory Content
                      </label>
                      <textarea 
                        name="content"
                        value={advisoryForm.content}
                        onChange={handleAdvisoryFormChange}
                        rows={6} 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                        placeholder="Write your advisory content here..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attach File (Optional)
                      </label>
                      {!attachedFile ? (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <input
                            type="file"
                            onChange={handleFileAttachment}
                            className="hidden"
                            id="file-attachment"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          />
                          <label htmlFor="file-attachment" className="cursor-pointer">
                            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, DOC, or image files up to 10MB
                            </p>
                          </label>
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="text-sm font-medium text-gray-900">{attachedFile.name}</p>
                                <p className="text-xs text-gray-500">{attachedFile.size}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={removeAttachedFile}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CSV Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload CSV Data (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="hidden"
                          id="csv-upload"
                        />
                        <label htmlFor="csv-upload" className="cursor-pointer">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload CSV file
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Only CSV files accepted
                          </p>
                        </label>
                      </div>
                      
                      {csvError && (
                        <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                            <span className="text-sm text-red-700">{csvError}</span>
                          </div>
                        </div>
                      )}

                      {csvData && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                              <span className="text-sm text-green-700">
                                Successfully parsed {csvData.length} records
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setCsvData(null);
                                setCsvError('');
                              }}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-2 max-h-32 overflow-y-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b">
                                  {Object.keys(csvData[0] || {}).map(key => (
                                    <th key={key} className="text-left py-1">{key}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {csvData.slice(0, 3).map((row, index) => (
                                  <tr key={index} className="border-b">
                                    {Object.values(row).map((value, i) => (
                                      <td key={i} className="py-1">{String(value)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {csvData.length > 3 && (
                              <p className="text-xs text-gray-500 mt-1">
                                Showing first 3 rows of {csvData.length} total records
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <button type="submit" className="w-full bg-accent-600 text-white py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors">
                      Publish Advisory
                    </button>
                  </form>
                </div>
                
                {/* Recent Advisories */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Advisories</h3>
                  <div className="space-y-3">
                    {advisories.map((advisory) => (
                      <div key={advisory.id} className="border-l-4 border-accent-400 pl-4 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-gray-900">{advisory.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getUrgencyColor(advisory.urgency)}`}>
                            {advisory.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{advisory.date}</p>
                        <div className="flex flex-wrap gap-1">
                          {advisory.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Training Feedback</h2>
              
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div key={training.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{training.title}</h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {training.date}
                          </span>
                          <span className="text-sm text-gray-600">
                            {training.participants} participants
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Overall Rating</p>
                        <p className="font-medium text-accent-600">{training.feedback}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <button className="px-4 py-2 text-accent-600 border border-accent-600 rounded-lg hover:bg-accent-50 transition-colors">
                        View Detailed Feedback
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Suggestion</h2>
              
              <div className="bg-white rounded-lg shadow p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suggestion Category
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                      <option>Platform Improvement</option>
                      <option>Training Program</option>
                      <option>Farmer Support</option>
                      <option>Technology Enhancement</option>
                      <option>Policy Recommendation</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Suggestion Title
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Brief title for your suggestion..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea 
                      rows={6} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="Provide detailed description of your suggestion..."
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Impact
                    </label>
                    <textarea 
                      rows={3} 
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                      placeholder="What impact do you expect this suggestion to have?"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level
                    </label>
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-accent-500 focus:border-transparent">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                  
                  <button className="w-full bg-accent-600 text-white py-2 px-4 rounded-lg hover:bg-accent-700 transition-colors">
                    Submit Suggestion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Quick Upload Advisory</h2>
                <button
                  onClick={closeUploadModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!uploadedAdvisory ? (
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Upload an advisory file to quickly share with farmers. Supported formats: PDF, DOC, DOCX, CSV, and images.
                  </p>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={handleQuickAdvisoryUpload}
                      className="hidden"
                      id="quick-advisory-upload"
                      accept=".pdf,.doc,.docx,.csv,.jpg,.jpeg,.png"
                    />
                    <label htmlFor="quick-advisory-upload" className="cursor-pointer">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, CSV, or image files
                      </p>
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={() => setActiveTab('advisory')}
                      className="text-accent-600 hover:text-accent-700 font-medium"
                    >
                      Or create detailed advisory →
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                      <span className="text-sm text-green-700 font-medium">
                        File uploaded successfully!
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadedAdvisory.name}</p>
                        <p className="text-xs text-gray-500">{uploadedAdvisory.size} • {uploadedAdvisory.uploadDate}</p>
                      </div>
                    </div>
                  </div>

                  {csvData && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-4 w-4 text-blue-400 mr-2" />
                        <span className="text-sm text-blue-700 font-medium">
                          CSV data parsed successfully
                        </span>
                      </div>
                      <p className="text-xs text-blue-600">
                        {csvData.length} records ready for processing
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={closeUploadModal}
                      className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('advisory');
                        setShowUploadModal(false);
                      }}
                      className="flex-1 px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertDashboard;