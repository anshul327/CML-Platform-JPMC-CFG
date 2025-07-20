import mongoose from 'mongoose';

// Training schema to store details of training sessions
const TrainingSchema = new mongoose.Schema({
  attendees: { type: Number, required: true }, // Number of attendees in the training
  subject: { type: String, required: true } // Subject/topic of the training
}, { timestamps: true });

export default mongoose.model('Training', TrainingSchema);