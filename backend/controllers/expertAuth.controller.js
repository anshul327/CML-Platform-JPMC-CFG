import Expert from '../models/Expert.js';
import jwt from 'jsonwebtoken';

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate JWT Token
const generateToken = (expertId) => {
  return jwt.sign({ expertId }, JWT_SECRET, { expiresIn: '24h' });
};

// Expert Signup
export const signup = async (req, res) => {
  try {
    const { 
      expertId, 
      expertName, 
      email, 
      password, 
      phone, 
      specialization, 
      qualification, 
      experience,
      supervisorId 
    } = req.body;

    // Check if Expert already exists
    const existingExpert = await Expert.findOne({ 
      $or: [{ email }, { expertId }] 
    });

    if (existingExpert) {
      return res.status(400).json({
        success: false,
        message: 'Expert with this email or ID already exists'
      });
    }

    // Create new Expert with default values for required fields
    const newExpert = new Expert({
      expertId,
      expertName,
      email,
      password,
      phone,
      specialization,
      qualification,
      experience,
      supervisorId, // Optional supervisor assignment
      dateOfReview: new Date(), // Default to current date
      farmerIds: [], // Empty array initially
      suggestedBestPractices: [], // Empty array initially
      resourceNeeds: [], // Empty array initially
      followUpRequired: false
    });

    await newExpert.save();

    // Generate token
    const token = generateToken(expertId);

    res.status(201).json({
      success: true,
      message: 'Expert registered successfully',
      data: {
        expertId: newExpert.expertId,
        expertName: newExpert.expertName,
        email: newExpert.email,
        specialization: newExpert.specialization,
        qualification: newExpert.qualification,
        experience: newExpert.experience,
        supervisorId: newExpert.supervisorId
      },
      token
    });

  } catch (error) {
    console.error('Expert signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Expert Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find Expert by email
    const expert = await Expert.findOne({ email });

    if (!expert) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (expert.isLocked()) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    // Check if account is active
    if (!expert.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Verify password
    const isPasswordValid = await expert.comparePassword(password);

    if (!isPasswordValid) {
      // Increment login attempts
      await expert.incLoginAttempts();
      
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Reset login attempts on successful login
    if (expert.loginAttempts > 0) {
      await Expert.updateOne(
        { _id: expert._id },
        { 
          $set: { loginAttempts: 0, lastLogin: new Date() },
          $unset: { lockUntil: 1 }
        }
      );
    } else {
      await Expert.updateOne(
        { _id: expert._id },
        { $set: { lastLogin: new Date() } }
      );
    }

    // Generate token
    const token = generateToken(expert.expertId);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        expertId: expert.expertId,
        expertName: expert.expertName,
        email: expert.email,
        specialization: expert.specialization,
        qualification: expert.qualification,
        experience: expert.experience,
        lastLogin: expert.lastLogin
      },
      token
    });

  } catch (error) {
    console.error('Expert login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Expert Signout
export const signout = async (req, res) => {
  try {
    // In a stateless JWT system, the client should remove the token
    // But we can log the signout for audit purposes
    const { expertId } = req.user; // This would come from JWT middleware

    res.status(200).json({
      success: true,
      message: 'Signout successful'
    });

  } catch (error) {
    console.error('Expert signout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Expert Profile
export const getProfile = async (req, res) => {
  try {
    const { expertId } = req.user; // This would come from JWT middleware

    const expert = await Expert.findOne({ expertId }).select('-password -loginAttempts -lockUntil');

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.status(200).json({
      success: true,
      data: expert
    });

  } catch (error) {
    console.error('Get expert profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Expert Profile
export const updateProfile = async (req, res) => {
  try {
    const { expertId } = req.user; // This would come from JWT middleware
    const { expertName, phone, specialization, qualification, experience } = req.body;

    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { expertName, phone, specialization, qualification, experience },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    if (!updatedExpert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Update expert profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 