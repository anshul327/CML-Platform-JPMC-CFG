import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ExpertSchema = new mongoose.Schema({
  expertName: { type: String, required: true },
  dateOfReview: { type: Date, required: true },
  linkedCrpId: { type: String, required: false },
  farmerIds: [{ type: String, required: true }],
  suggestedBestPractices: [{ type: String }],
  seasonalRecommendations: { type: String },
  resourceNeeds: [{ type: String }],
  followUpRequired: { type: Boolean, default: false },
  
  // Authentication fields
  expertId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String, 
    required: true 
  },
  specialization: { 
    type: String, 
    required: true 
  },
  qualification: { 
    type: String, 
    required: true 
  },
  experience: { 
    type: Number, 
    required: true 
  },
  supervisorId: { 
    type: String, 
    required: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastLogin: { 
    type: Date 
  },
  loginAttempts: { 
    type: Number, 
    default: 0 
  },
  lockUntil: { 
    type: Date 
  }
}, { timestamps: true });

// Hash password before saving
ExpertSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
ExpertSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
ExpertSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
ExpertSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 2 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

export default mongoose.model('Expert', ExpertSchema); 