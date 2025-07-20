import mongoose from 'mongoose';

// Problem schema to track issues faced by farmers
const ProblemSchema = new mongoose.Schema({
  issue: { type: String, required: true }, // Issue selected from dropdown
  description: { type: String }, // Additional description of the issue
  solved: { type: Boolean, default: false }, // Status if the problem is solved
  farmerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Farmer', 
    required: true 
  }, // Reference to Farmer (foreign key)
  image: { type: String }, // Optional image of the problem
  video: { type: String } // Optional video of the problem
}, { timestamps: true });

export default mongoose.model('Problem', ProblemSchema);
