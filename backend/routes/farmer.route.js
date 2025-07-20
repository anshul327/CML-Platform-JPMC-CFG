import express from 'express';
import { 
    createFarmer, 
    getFarmers, 
    getFarmerById, 
    updateFarmer, 
    deleteFarmer 
} from '../controllers/farmer.controller.js';

const router = express.Router();

// Create a new farmer
router.post('/create', createFarmer);

// Get all farmers
router.get('/all', getFarmers);

// Get farmer by ID
router.get('/:id', getFarmerById);

// Update farmer
router.put('/:id', updateFarmer);

// Delete farmer
router.delete('/:id', deleteFarmer);

export default router; 