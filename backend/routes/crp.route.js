import express from 'express';
import { 
    createCRP, 
    getCRPs, 
    getCRPById, 
    updateCRP, 
    deleteCRP,
    getFarmersUnderCRP,
    getCRPDashboard,
    addFarmerToCRP,
    removeFarmerFromCRP,
    updateCRPVisitReport,
    getFarmerDetails,
    getFarmersByDistrict,
    getFarmersByCrop
} from '../controllers/crp.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Create a new CRP report
router.post('/create', createCRP);

// Get all CRP reports
router.get('/all', getCRPs);

// Get CRP by ID
router.get('/:id', getCRPById);

// Update CRP
router.put('/:id', updateCRP);

// Delete CRP
router.delete('/:id', deleteCRP);

// CRP-specific operations for managing Farmers
router.get('/farmers', getFarmersUnderCRP);
router.get('/dashboard', getCRPDashboard);

// Farmer management
router.post('/add-farmer', addFarmerToCRP);
router.delete('/remove-farmer/:farmerId', removeFarmerFromCRP);

// Update visit report
router.put('/visit-report', updateCRPVisitReport);

// Get farmer details
router.get('/farmer/:farmerId', getFarmerDetails);

// Filter farmers
router.get('/farmers/district/:district', getFarmersByDistrict);
router.get('/farmers/crop/:crop', getFarmersByCrop);

export default router; 