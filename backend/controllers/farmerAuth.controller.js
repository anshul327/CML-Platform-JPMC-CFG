import Farmer from '../models/Farmer.js';
import jwt from 'jsonwebtoken';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (farmerId) => {
  return jwt.sign({ farmerId }, JWT_SECRET, { expiresIn: '24h' });
};

// Farmer Signup
export const signup = async (req, res) => {
  try {
    const { 
      farmerId, 
      fullName, 
      email, 
      password, 
      age, 
      gender, 
      contactNumber, 
      village, 
      district, 
      state, 
      landSize, 
      landUnit, 
      cropGrown, 
      typeOfIrrigation 
    } = req.body;

    // Check if Farmer already exists
    const existingFarmer = await Farmer.findOne({ 
      $or: [{ email }, { farmerId }] 
    });

    if (existingFarmer) {
      return res.status(400).json({
        success: false,
        message: 'Farmer with this email or ID already exists'
      });
    }

    // Create new Farmer with default values for optional fields
    const newFarmer = new Farmer({
      farmerId,
      fullName,
      email,
      password,
      age,
      gender,
      contactNumber,
      village,
      district,
      state,
      landSize,
      landUnit,
      cropGrown,
      typeOfIrrigation,
      livelihoodActivities: [], // Empty array initially
      workshopsOrTraining: [], // Empty array initially
      issuesFaced: [], // Empty array initially
      otherIssues: '' // Empty string initially
    });

    await newFarmer.save();

    // Generate token
    const token = generateToken(farmerId);

    res.status(201).json({
      success: true,
      message: 'Farmer registered successfully',
      data: {
        farmerId: newFarmer.farmerId,
        fullName: newFarmer.fullName,
        email: newFarmer.email,
        village: newFarmer.village,
        district: newFarmer.district,
        state: newFarmer.state,
        cropGrown: newFarmer.cropGrown
      },
      token
    });

  } catch (error) {
    console.error('Farmer signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Farmer Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Farmer by email
    const farmer = await Farmer.findOne({ email });

    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (farmer.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check if account is active
    if (!farmer.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await farmer.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await farmer.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (farmer.loginAttempts > 0) {
      await Farmer.updateOne(
        { _id: farmer._id },
        { 
          $set: { loginAttempts: 0, lastLogin: new Date() },
          $unset: { lockUntil: 1 }
        }
      );
    } else {
      await Farmer.updateOne(
        { _id: farmer._id },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate token
    const token = generateToken(farmer.farmerId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        farmerId: farmer.farmerId,
        fullName: farmer.fullName,
        email: farmer.email,
        village: farmer.village,
        district: farmer.district,
        state: farmer.state,
        cropGrown: farmer.cropGrown,
        lastLogin: farmer.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Farmer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Farmer Signout
export const signout = async (req, res) => {
  try {
    // In a stateless JWT system, the client should remove the token
    // But we can log the signout for audit purposes
    const { farmerId } = req.user; // This would come from JWT middleware

    res.status(200).json({
      success: true,
      message: 'Signout successful'
    });

  } catch (error) {
    console.error('Farmer signout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Farmer Profile
export const getProfile = async (req, res) => {
  try {
    const { farmerId } = req.user; // This would come from JWT middleware

    const farmer = await Farmer.findOne({ farmerId }).select('-password -loginAttempts -lockUntil');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      data: farmer
    });

  } catch (error) {
    console.error('Get farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Farmer Profile
export const updateProfile = async (req, res) => {
  try {
    const { farmerId } = req.user; // This would come from JWT middleware
    const { 
      fullName, 
      contactNumber, 
      village, 
      district, 
      state, 
      landSize, 
      landUnit, 
      cropGrown, 
      typeOfIrrigation,
      livelihoodActivities,
      workshopsOrTraining,
      issuesFaced,
      otherIssues
    } = req.body;

    const updatedFarmer = await Farmer.findOneAndUpdate(
      { farmerId },
      { 
        fullName, 
        contactNumber, 
        village, 
        district, 
        state, 
        landSize, 
        landUnit, 
        cropGrown, 
        typeOfIrrigation,
        livelihoodActivities,
        workshopsOrTraining,
        issuesFaced,
        otherIssues
      },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!updatedFarmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedFarmer
    });

  } catch (error) {
    console.error('Update farmer profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 