import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const FarmerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  farmerId: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  contactNumber: { type: String, required: true },
  village: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String, required: true },
  landSize: { type: Number, required: true },
  landUnit: { type: String, enum: ['acres', 'hectares'], required: true },
  cropGrown: { type: String, required: true },
  typeOfIrrigation: { type: String, required: true },
  livelihoodActivities: [{ type: String }],
  workshopsOrTraining: [{ type: String }],
  issuesFaced: [{ type: String }],
  otherIssues: { type: String },
  
  // Authentication fields
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
FarmerSchema.pre('save', async function(next) {
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
FarmerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
FarmerSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
FarmerSchema.methods.incLoginAttempts = function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
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

export default mongoose.model('Farmer', FarmerSchema); 