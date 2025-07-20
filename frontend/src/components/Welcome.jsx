import { useState } from 'react';

const Welcome = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'features', label: 'Features', icon: '✨' },
    { id: 'benefits', label: 'Benefits', icon: '🎯' }
  ];

  const tabContent = {
    overview: {
      title: 'Welcome to Farmer Management System',
      description: 'A comprehensive digital platform designed to revolutionize agricultural management and connect farmers with expert guidance.',
      points: [
        '📈 Track farmer productivity and crop yields',
        '🤝 Connect farmers with agricultural experts',
        '📋 Manage field reports and interventions',
        '📊 Generate insights and analytics'
      ]
    },
    features: {
      title: 'Key Features',
      description: 'Discover the powerful tools that make agricultural management efficient and effective.',
      points: [
        '👨‍🌾 Farmer Registration & Management',
        '📋 CRP Report Generation',
        '🔬 Expert Review System',
        '📊 Real-time Dashboard Analytics'
      ]
    },
    benefits: {
      title: 'System Benefits',
      description: 'Experience the advantages of digital agricultural management.',
      points: [
        '🚀 Increased agricultural productivity',
        '💡 Expert guidance and best practices',
        '📱 Mobile-friendly interface',
        '🔒 Secure data management'
      ]
    }
  };

  const currentContent = tabContent[activeTab];

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-300 ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          {currentContent.title}
        </h2>
        <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
          {currentContent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentContent.points.map((point, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <span className="text-lg">{point.split(' ')[0]}</span>
            <span className="text-gray-700">{point.split(' ').slice(1).join(' ')}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <span>⚡</span>
          <span className="text-sm font-medium">Hot Module Replacement (HMR) is working!</span>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 