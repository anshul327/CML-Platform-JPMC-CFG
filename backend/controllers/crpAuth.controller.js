import CRP from '../models/CRP.js';
import jwt from 'jsonwebtoken';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (crpId) => {
  return jwt.sign({ crpId }, JWT_SECRET, { expiresIn: '24h' });
};

// CRP Signup
export const signup = async (req, res) => {
  try {
    const { crpId, crpName, email, password, phone, district, state } = req.body;

    // Check if CRP already exists
    const existingCRP = await CRP.findOne({ 
      $or: [{ email }, { crpId }] 
    });

    if (existingCRP) {
      return res.status(400).json({
        success: false,
        message: 'CRP with this email or ID already exists'
      });
    }

    // Create new CRP with default values for required fields
    const newCRP = new CRP({
      crpId,
      crpName,
      email,
      password,
      phone,
      district,
      state,
      dateOfVisit: new Date(), // Default to current date
      farmerIds: [], // Empty array initially
      summaryOfFarmerIssues: 'Initial registration', // Default value
      interventionsGiven: [] // Empty array initially
    });

    await newCRP.save();

    // Generate token
    const token = generateToken(crpId);

    res.status(201).json({
      success: true,
      message: 'CRP registered successfully',
      data: {
        crpId: newCRP.crpId,
        crpName: newCRP.crpName,
        email: newCRP.email,
        district: newCRP.district,
        state: newCRP.state
      },
      token
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// CRP Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find CRP by email
    const crp = await CRP.findOne({ email });

    if (!crp) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (crp.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check if account is active
    if (!crp.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await crp.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await crp.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (crp.loginAttempts > 0) {
      await CRP.updateOne(
        { _id: crp._id },
        { 
          $set: { loginAttempts: 0, lastLogin: new Date() },
          $unset: { lockUntil: 1 }
        }
      );
    } else {
      await CRP.updateOne(
        { _id: crp._id },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate token
    const token = generateToken(crp.crpId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        crpId: crp.crpId,
        crpName: crp.crpName,
        email: crp.email,
        district: crp.district,
        state: crp.state,
        lastLogin: crp.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// CRP Signout
export const signout = async (req, res) => {
  try {
    // In a stateless JWT system, the client should remove the token
    // But we can log the signout for audit purposes
    const { crpId } = req.user; // This would come from JWT middleware

    res.status(200).json({
      success: true,
      message: 'Signout successful'
    });

  } catch (error) {
    console.error('Signout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get CRP Profile
export const getProfile = async (req, res) => {
  try {
    const { crpId } = req.user; // This would come from JWT middleware

    const crp = await CRP.findOne({ crpId }).select('-password -loginAttempts -lockUntil');

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found'
      });
    }

    res.status(200).json({
      success: true,
      data: crp
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update CRP Profile
export const updateProfile = async (req, res) => {
  try {
    const { crpId } = req.user; // This would come from JWT middleware
    const { crpName, phone, district, state } = req.body;

    const updatedCRP = await CRP.findOneAndUpdate(
      { crpId },
      { crpName, phone, district, state },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!updatedCRP) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedCRP
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 