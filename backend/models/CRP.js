import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const CRPSchema = new mongoose.Schema({
  crpName: { type: String, required: true },
  crpId: { type: String, required: true, unique: true },
  dateOfVisit: { type: Date, required: true },
  farmerIds: [{ type: String, required: true }],
  summaryOfFarmerIssues: { type: String, required: true },
  interventionsGiven: [{ type: String }],
  notesForExpert: { type: String },
  
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
  district: { 
    type: String, 
    required: true 
  },
  state: { 
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

CRPSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

CRPSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

CRPSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

CRPSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $unset: { lockUntil: 1 },
      $set: { loginAttempts: 1 }
    });
  }
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 };
  }
  
  return this.updateOne(updates);
};

export default mongoose.model('CRP', CRPSchema); 