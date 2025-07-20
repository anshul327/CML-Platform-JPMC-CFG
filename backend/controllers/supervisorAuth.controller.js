import Supervisor from '../models/Supervisor.js';
import jwt from 'jsonwebtoken';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (supervisorId) => {
  return jwt.sign({ supervisorId }, JWT_SECRET, { expiresIn: '24h' });
};

// Supervisor Signup
export const signup = async (req, res) => {
  try {
    const { 
      supervisorId, 
      supervisorName, 
      email, 
      password, 
      phone, 
      accessLevel, 
      department, 
      region 
    } = req.body;

    // Check if Supervisor already exists
    const existingSupervisor = await Supervisor.findOne({ 
      $or: [{ email }, { supervisorId }] 
    });

    if (existingSupervisor) {
      return res.status(400).json({
        success: false,
        message: 'Supervisor with this email or ID already exists'
      });
    }

    // Create new Supervisor with default values for required fields
    const newSupervisor = new Supervisor({
      supervisorId,
      supervisorName,
      email,
      password,
      phone,
      accessLevel,
      department,
      region,
      aggregatedFarmerData: {
        totalFarmers: 0,
        farmersByDistrict: [],
        farmersByCrop: [],
        farmersByIssue: []
      },
      crpReports: [],
      expertRecommendations: [],
      priorityAreas: [],
      followUpTasks: [],
      exportHistory: []
    });

    await newSupervisor.save();

    // Generate token
    const token = generateToken(supervisorId);

    res.status(201).json({
      success: true,
      message: 'Supervisor registered successfully',
      data: {
        supervisorId: newSupervisor.supervisorId,
        supervisorName: newSupervisor.supervisorName,
        email: newSupervisor.email,
        accessLevel: newSupervisor.accessLevel,
        department: newSupervisor.department,
        region: newSupervisor.region
      },
      token
    });

  } catch (error) {
    console.error('Supervisor signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Supervisor Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Supervisor by email
    const supervisor = await Supervisor.findOne({ email });

    if (!supervisor) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (supervisor.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check if account is active
    if (!supervisor.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await supervisor.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await supervisor.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (supervisor.loginAttempts > 0) {
      await Supervisor.updateOne(
        { _id: supervisor._id },
        { 
          $set: { loginAttempts: 0, lastLogin: new Date() },
          $unset: { lockUntil: 1 }
        }
      );
    } else {
      await Supervisor.updateOne(
        { _id: supervisor._id },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate token
    const token = generateToken(supervisor.supervisorId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        supervisorId: supervisor.supervisorId,
        supervisorName: supervisor.supervisorName,
        email: supervisor.email,
        accessLevel: supervisor.accessLevel,
        department: supervisor.department,
        region: supervisor.region,
        lastLogin: supervisor.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Supervisor login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Supervisor Signout
export const signout = async (req, res) => {
  try {
    // In a stateless JWT system, the client should remove the token
    // But we can log the signout for audit purposes
    const { supervisorId } = req.user; // This would come from JWT middleware

    res.status(200).json({
      success: true,
      message: 'Signout successful'
    });

  } catch (error) {
    console.error('Supervisor signout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Supervisor Profile
export const getProfile = async (req, res) => {
  try {
    const { supervisorId } = req.user; // This would come from JWT middleware

    const supervisor = await Supervisor.findOne({ supervisorId }).select('-password -loginAttempts -lockUntil');

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: supervisor
    });

  } catch (error) {
    console.error('Get supervisor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Supervisor Profile
export const updateProfile = async (req, res) => {
  try {
    const { supervisorId } = req.user; // This would come from JWT middleware
    const { supervisorName, phone, department, region } = req.body;

    const updatedSupervisor = await Supervisor.findOneAndUpdate(
      { supervisorId },
      { supervisorName, phone, department, region },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!updatedSupervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedSupervisor
    });

  } catch (error) {
    console.error('Update supervisor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 