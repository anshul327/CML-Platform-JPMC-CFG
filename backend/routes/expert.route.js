import express from 'express';
import { 
    createExpert, 
    getExperts, 
    getExpertById, 
    updateExpert, 
    deleteExpert,
    getCRPsUnderExpert,
    getFarmersUnderExpert,
    getExpertDashboard,
    linkCRPToExpert,
    unlinkCRPFromExpert,
    addFarmerToExpert,
    removeFarmerFromExpert,
    updateExpertRecommendations
} from '../controllers/expert.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Basic CRUD operations for experts
router.post('/create', createExpert);
router.get('/all', getExperts);
router.get('/:id', getExpertById);
router.put('/:id', updateExpert);
router.delete('/:id', deleteExpert);

// Expert-specific operations for managing CRPs and Farmers
router.get('/crps', getCRPsUnderExpert);
router.get('/farmers', getFarmersUnderExpert);
router.get('/dashboard', getExpertDashboard);

// CRP management
router.post('/link-crp', linkCRPToExpert);
router.delete('/unlink-crp', unlinkCRPFromExpert);

// Farmer management
router.post('/add-farmer', addFarmerToExpert);
router.delete('/remove-farmer/:farmerId', removeFarmerFromExpert);

// Update recommendations
router.put('/recommendations', updateExpertRecommendations);

export default router; 