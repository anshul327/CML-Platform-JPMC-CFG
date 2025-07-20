import jwt from 'jsonwebtoken';
import CRP from '../models/CRP.js';
import Expert from '../models/Expert.js';
import Supervisor from '../models/Supervisor.js';
import Farmer from '../models/Farmer.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    let user = null;
    let userType = '';

    // Check which type of user based on the token payload
    if (decoded.crpId) {
      user = await CRP.findOne({ 
        crpId: decoded.crpId,
        isActive: true 
      });
      userType = 'CRP';
    } else if (decoded.expertId) {
      user = await Expert.findOne({ 
        expertId: decoded.expertId,
        isActive: true 
      });
      userType = 'Expert';
    } else if (decoded.supervisorId) {
      user = await Supervisor.findOne({ 
        supervisorId: decoded.supervisorId,
        isActive: true 
      });
      userType = 'Supervisor';
    } else if (decoded.farmerId) {
      user = await Farmer.findOne({ 
        farmerId: decoded.farmerId,
        isActive: true 
      });
      userType = 'Farmer';
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // Add user info to request
    req.user = {
      ...decoded,
      userType,
      name: user.crpName || user.expertName || user.supervisorName || user.fullName,
      email: user.email
    };

    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}; 