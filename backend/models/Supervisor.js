import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const SupervisorSchema = new mongoose.Schema({
  supervisorName: { type: String, required: true },
  supervisorId: { type: String, required: true, unique: true },
  accessLevel: { type: String, enum: ['supervisor', 'manager'], required: true },
  aggregatedFarmerData: {
    totalFarmers: { type: Number, default: 0 },
    farmersByDistrict: [{ district: String, count: Number }],
    farmersByCrop: [{ crop: String, count: Number }],
    farmersByIssue: [{ issue: String, count: Number }]
  },
  crpReports: [{
    crpId: { type: String },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'] },
    lastUpdated: { type: Date }
  }],
  expertRecommendations: [{
    expertId: { type: String },
    recommendationCount: { type: Number },
    followUpRequired: { type: Boolean }
  }],
  priorityAreas: [{ type: String }],
  followUpTasks: [{
    taskId: { type: String },
    description: { type: String },
    assignedTo: { type: String },
    dueDate: { type: Date },
    status: { type: String, enum: ['pending', 'in_progress', 'completed'] }
  }],
  exportHistory: [{
    exportType: { type: String },
    exportDate: { type: Date },
    fileName: { type: String }
  }],
  
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
  phone: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  region: { 
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
SupervisorSchema.pre('save', async function(next) {
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
SupervisorSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if account is locked
SupervisorSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Method to increment login attempts
SupervisorSchema.methods.incLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return await this.constructor.updateOne(
      { _id: this._id },
      {
        $unset: { lockUntil: 1 },
        $set: { loginAttempts: 1 }
      }
    );
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after 5 failed attempts for 2 hours
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return await this.constructor.updateOne({ _id: this._id }, updates);
};

export default mongoose.model('Supervisor', SupervisorSchema); 