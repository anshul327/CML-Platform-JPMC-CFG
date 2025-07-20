import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import farmerRouter from './routes/farmer.route.js';
import farmerAuthRouter from './routes/farmerAuth.route.js';
import crpRouter from './routes/crp.route.js';
import crpAuthRouter from './routes/crpAuth.route.js';
import expertRouter from './routes/expert.route.js';
import expertAuthRouter from './routes/expertAuth.route.js';
import supervisorRouter from './routes/supervisor.route.js';
import supervisorAuthRouter from './routes/supervisorAuth.route.js';
import smsRouter from './fast2sms/sms.route.js'; // Import SMS route

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  // origin: ['http://localhost:5173', 'http://localhost:5000'],
  origin: '*',
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());

app.use('/api/farmers', farmerRouter);
app.use('/api/farmer-auth', farmerAuthRouter);
app.use('/api/crp', crpRouter);
app.use('/api/crp-auth', crpAuthRouter);
app.use('/api/expert', expertRouter);
app.use('/api/expert-auth', expertAuthRouter);
app.use('/api/supervisor', supervisorRouter);
app.use('/api/supervisor-auth', supervisorAuthRouter);

app.use('/api/sms', smsRouter); // Use SMS route

app.get('/', (req, res) => {
    res.send('Farmer Management System Backend server is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

mongoose.connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.log('Error connecting to MongoDB:', err);
});

app.listen(PORT, () => {
    console.log(`Server is running on Port: ${PORT}`);
});
