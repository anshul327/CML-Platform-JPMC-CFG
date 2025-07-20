import Welcome from '../components/Welcome';
import FeatureCard from '../components/FeatureCard';

const Home = () => {
  const features = [
    {
      icon: '👨‍🌾',
      title: 'Farmers',
      description: 'Manage farmer details and information',
      stats: '1,250+ Farmers'
    },
    {
      icon: '📋',
      title: 'CRP Reports',
      description: 'Track field executive reports',
      stats: '450+ Reports'
    },
    {
      icon: '🔬',
      title: 'Expert Reviews',
      description: 'Agricultural expert recommendations',
      stats: '200+ Reviews'
    }
  ];

  const stats = [
    { number: '1,250+', label: 'Registered Farmers', icon: '👨‍🌾' },
    { number: '450+', label: 'CRP Reports', icon: '📋' },
    { number: '200+', label: 'Expert Reviews', icon: '🔬' },
    { number: '95%', label: 'Satisfaction Rate', icon: '⭐' }
  ];

  const handleFeatureClick = (feature) => {
    console.log(`Clicked on ${feature.title}`);
    // TODO: Navigate to specific feature page
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            🌾 Farmer Management System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Empowering agriculture through technology. Connect farmers with experts, 
            track field reports, and improve agricultural productivity with data-driven insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
              Get Started
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            System Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-600 mb-1">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Welcome />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Our Core Features
          </h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Comprehensive tools designed to streamline agricultural management and 
            connect farmers with the expertise they need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <FeatureCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  onClick={() => handleFeatureClick(feature)}
                />
                <div className="text-center mt-3">
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {feature.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Register Farmers</h3>
              <p className="text-gray-600">
                Field executives collect and register farmer details including land size, 
                crops grown, and contact information.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">CRP Reports</h3>
              <p className="text-gray-600">
                Community Resource Persons create detailed reports about farmer issues 
                and interventions provided.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Review</h3>
              <p className="text-gray-600">
                Agricultural experts review reports and provide recommendations 
                for best practices and solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Agriculture?
          </h2>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and agricultural professionals who are already 
            using our platform to improve productivity and sustainability.
          </p>
          <button className="bg-white text-green-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-300">
            Start Your Journey Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home; 