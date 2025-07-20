import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-green-600 to-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-4xl animate-pulse">🌾</div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Farmer Management System
              </h1>
              <p className="text-green-100 text-sm">Empowering Agriculture</p>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#farmers" 
              className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-1"
            >
              <span>👨‍🌾</span>
              <span>Farmers</span>
            </a>
            <a 
              href="#crp" 
              className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-1"
            >
              <span>📋</span>
              <span>CRP Reports</span>
            </a>
            <a 
              href="#expert" 
              className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-1"
            >
              <span>🔬</span>
              <span>Expert Reviews</span>
            </a>
            <a 
              href="#dashboard" 
              className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-1"
            >
              <span>📊</span>
              <span>Dashboard</span>
            </a>
          </nav>
          
          <button 
            className="md:hidden text-white hover:text-green-200 transition-colors"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-green-500">
            <nav className="flex flex-col space-y-3 pt-4">
              <a 
                href="#farmers" 
                className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-2"
              >
                <span>👨‍🌾</span>
                <span>Farmers</span>
              </a>
              <a 
                href="#crp" 
                className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-2"
              >
                <span>📋</span>
                <span>CRP Reports</span>
              </a>
              <a 
                href="#expert" 
                className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-2"
              >
                <span>🔬</span>
                <span>Expert Reviews</span>
              </a>
              <a 
                href="#dashboard" 
                className="text-white hover:text-green-200 transition-colors duration-300 font-medium flex items-center space-x-2"
              >
                <span>📊</span>
                <span>Dashboard</span>
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 