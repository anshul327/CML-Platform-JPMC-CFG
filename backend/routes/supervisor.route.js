import express from 'express';
import { 
    getSupervisorData, 
    getAggregatedFarmerData, 
    getCRPReports, 
    getExpertRecommendations,
    createFollowUpTask,
    updateFollowUpTask,
    exportData,
    getExpertsUnderSupervisor,
    getCRPsUnderSupervisor,
    getFarmersUnderSupervisor,
    getSupervisorDashboard,
    assignExpertToSupervisor,
    removeExpertFromSupervisor
} from '../controllers/supervisor.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and supervisor access
router.use(authenticateToken);

// Get supervisor overview data
router.get('/overview', getSupervisorData);

// Get aggregated farmer data
router.get('/farmers/aggregated', getAggregatedFarmerData);

// Get CRP reports with status
router.get('/crp-reports', getCRPReports);

// Get expert recommendations
router.get('/expert-recommendations', getExpertRecommendations);

// Create follow-up task
router.post('/follow-up', createFollowUpTask);

// Update follow-up task
router.put('/follow-up/:id', updateFollowUpTask);

// Export data
router.get('/export/:type', exportData);

// Get all Experts under the authenticated Supervisor
router.get('/experts', getExpertsUnderSupervisor);

// Get all CRPs under the authenticated Supervisor (through experts)
router.get('/crps', getCRPsUnderSupervisor);

// Get all Farmers under the authenticated Supervisor (through experts and CRPs)
router.get('/farmers', getFarmersUnderSupervisor);

// Get dashboard statistics for the authenticated Supervisor
router.get('/dashboard', getSupervisorDashboard);

// Assign an Expert to the authenticated Supervisor
router.post('/assign-expert', assignExpertToSupervisor);

// Remove an Expert from the authenticated Supervisor
router.delete('/remove-expert/:expertId', removeExpertFromSupervisor);

export default router; 