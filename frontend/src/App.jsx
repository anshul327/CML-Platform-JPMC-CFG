import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import AIAssistantPage from './pages/AIAssistantPage';
import AddFarmer from './pages/AddFarmer';
import ProtectedRoute from './components/ProtectedRoute';
// import FarmerDashboard from './pages/dashboards/FarmerDashboard';
import CRPDashboard from './pages/dashboards/CRPDashboard';
import ExpertDashboard from './pages/dashboards/ExpertDashboard';
import SupervisorDashboard from './pages/dashboards/SupervisorDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          
          {/* Protected Dashboard Routes */}
          {/* <Route 
            path="/farmer-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['farmer']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } 
          /> */}
          <Route 
            path="/crp-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['crp']}>
                <CRPDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/expert-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['expert']}>
                <ExpertDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/supervisor-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['supervisor']}>
                <SupervisorDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* CRP Management Routes */}
          <Route 
            path="/add-farmer" 
            element={
              <ProtectedRoute allowedRoles={['crp']}>
                <AddFarmer />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy Routes (for backward compatibility) */}
          <Route path="/crp" element={<div>CRP Dashboard - Coming Soon</div>} />
          <Route path="/expert" element={<div>Expert Dashboard - Coming Soon</div>} />
          <Route path="/admin" element={<div>Admin Dashboard - Coming Soon</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
