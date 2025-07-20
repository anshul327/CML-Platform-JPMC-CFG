import Supervisor from '../models/Supervisor.js';
import Farmer from '../models/Farmer.js';
import CRP from '../models/CRP.js';
import Expert from '../models/Expert.js';

// Get supervisor overview data
export const getSupervisorData = async (req, res, next) => {
    try {
        const totalFarmers = await Farmer.countDocuments();
        const totalCRPs = await CRP.countDocuments();
        const totalExperts = await Expert.countDocuments();
        
        res.status(200).json({
            success: true,
            data: {
                totalFarmers,
                totalCRPs,
                totalExperts,
                lastUpdated: new Date()
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get aggregated farmer data
export const getAggregatedFarmerData = async (req, res, next) => {
    try {
        const farmers = await Farmer.find();
        
        // Aggregate data by district
        const farmersByDistrict = {};
        const farmersByCrop = {};
        const farmersByIssue = {};
        
        farmers.forEach(farmer => {
            // By district
            farmersByDistrict[farmer.district] = (farmersByDistrict[farmer.district] || 0) + 1;
            
            // By crop
            farmersByCrop[farmer.cropGrown] = (farmersByCrop[farmer.cropGrown] || 0) + 1;
            
            // By issues
            farmer.issuesFaced.forEach(issue => {
                farmersByIssue[issue] = (farmersByIssue[issue] || 0) + 1;
            });
        });
        
        res.status(200).json({
            success: true,
            data: {
                totalFarmers: farmers.length,
                farmersByDistrict,
                farmersByCrop,
                farmersByIssue
            }
        });
    } catch (error) {
        next(error);
    }
};

// Get CRP reports with status
export const getCRPReports = async (req, res, next) => {
    try {
        const crps = await CRP.find().sort({ dateOfVisit: -1 });
        
        const reportsWithStatus = crps.map(crp => ({
            crpId: crp.crpId,
            crpName: crp.crpName,
            dateOfVisit: crp.dateOfVisit,
            status: 'completed', // Demo status
            lastUpdated: crp.updatedAt
        }));
        
        res.status(200).json({
            success: true,
            count: reportsWithStatus.length,
            data: reportsWithStatus
        });
    } catch (error) {
        next(error);
    }
};

// Get expert recommendations
export const getExpertRecommendations = async (req, res, next) => {
    try {
        const experts = await Expert.find().sort({ dateOfReview: -1 });
        
        const recommendations = experts.map(expert => ({
            expertId: expert._id,
            expertName: expert.expertName,
            recommendationCount: expert.suggestedBestPractices.length,
            followUpRequired: expert.followUpRequired,
            dateOfReview: expert.dateOfReview
        }));
        
        res.status(200).json({
            success: true,
            count: recommendations.length,
            data: recommendations
        });
    } catch (error) {
        next(error);
    }
};

// Create follow-up task
export const createFollowUpTask = async (req, res, next) => {
    try {
        const { description, assignedTo, dueDate } = req.body;
        
        const newTask = {
            taskId: Date.now().toString(),
            description,
            assignedTo,
            dueDate: new Date(dueDate),
            status: 'pending'
        };
        
        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (error) {
        next(error);
    }
};

// Update follow-up task
export const updateFollowUpTask = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        res.status(200).json({
            success: true,
            message: 'Follow-up task updated successfully',
            data: { taskId: req.params.id, status }
        });
    } catch (error) {
        next(error);
    }
};

// Export data
export const exportData = async (req, res, next) => {
    try {
        const { type } = req.params;
        
        let data = [];
        switch (type) {
            case 'farmers':
                data = await Farmer.find();
                break;
            case 'crp':
                data = await CRP.find();
                break;
            case 'expert':
                data = await Expert.find();
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid export type'
                });
        }
        
        res.status(200).json({
            success: true,
            message: `${type} data exported successfully`,
            count: data.length,
            data: data
        });
    } catch (error) {
        next(error);
    }
};

// Get all Experts under a Supervisor
export const getExpertsUnderSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Get all experts assigned to this supervisor
    const experts = await Expert.find({ 
      supervisorId,
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Experts retrieved successfully',
      data: {
        supervisorId: supervisor.supervisorId,
        supervisorName: supervisor.supervisorName,
        totalExperts: experts.length,
        experts: experts
      }
    });

  } catch (error) {
    console.error('Get experts under supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all CRPs under a Supervisor (through experts)
export const getCRPsUnderSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Get all experts under this supervisor
    const experts = await Expert.find({ 
      supervisorId,
      isActive: true 
    }).select('expertId expertName linkedCrpId');

    // Get unique CRP IDs from experts
    const crpIds = [...new Set(experts.map(expert => expert.linkedCrpId).filter(id => id))];

    // Get CRP details
    const crps = await CRP.find({ 
      crpId: { $in: crpIds },
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'CRPs retrieved successfully',
      data: {
        supervisorId: supervisor.supervisorId,
        supervisorName: supervisor.supervisorName,
        totalCRPs: crps.length,
        crps: crps
      }
    });

  } catch (error) {
    console.error('Get CRPs under supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all Farmers under a Supervisor (through CRPs and Experts)
export const getFarmersUnderSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Get all experts under this supervisor
    const experts = await Expert.find({ 
      supervisorId,
      isActive: true 
    }).select('farmerIds');

    // Get all unique farmer IDs from experts
    const farmerIds = [...new Set(experts.flatMap(expert => expert.farmerIds))];

    // Get farmer details
    const farmers = await Farmer.find({ 
      farmerId: { $in: farmerIds },
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmers retrieved successfully',
      data: {
        supervisorId: supervisor.supervisorId,
        supervisorName: supervisor.supervisorName,
        totalFarmers: farmers.length,
        farmers: farmers
      }
    });

  } catch (error) {
    console.error('Get farmers under supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get dashboard statistics for Supervisor
export const getSupervisorDashboard = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Get counts
    const expertsCount = await Expert.countDocuments({ 
      supervisorId,
      isActive: true 
    });

    const experts = await Expert.find({ 
      supervisorId,
      isActive: true 
    }).select('linkedCrpId farmerIds');

    const crpIds = [...new Set(experts.map(expert => expert.linkedCrpId).filter(id => id))];
    const crpsCount = await CRP.countDocuments({ 
      crpId: { $in: crpIds },
      isActive: true 
    });

    const farmerIds = [...new Set(experts.flatMap(expert => expert.farmerIds))];
    const farmersCount = await Farmer.countDocuments({ 
      farmerId: { $in: farmerIds },
      isActive: true 
    });

    // Get recent activities
    const recentExperts = await Expert.find({ 
      supervisorId,
      isActive: true 
    })
    .select('expertName specialization lastLogin')
    .sort({ lastLogin: -1 })
    .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        supervisorId: supervisor.supervisorId,
        supervisorName: supervisor.supervisorName,
        statistics: {
          totalExperts: expertsCount,
          totalCRPs: crpsCount,
          totalFarmers: farmersCount
        },
        recentActivities: {
          recentExperts: recentExperts
        }
      }
    });

  } catch (error) {
    console.error('Get supervisor dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Assign Expert to Supervisor
export const assignExpertToSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware
    const { expertId } = req.body;

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Verify the expert exists and is active
    const expert = await Expert.findOne({ 
      expertId,
      isActive: true 
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found or inactive'
      });
    }

    // Check if expert is already assigned to another supervisor
    if (expert.supervisorId && expert.supervisorId !== supervisorId) {
      return res.status(400).json({
        success: false,
        message: 'Expert is already assigned to another supervisor'
      });
    }

    // Assign expert to supervisor
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { supervisorId },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Expert assigned to supervisor successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Assign expert to supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Remove Expert from Supervisor
export const removeExpertFromSupervisor = async (req, res) => {
  try {
    const { supervisorId } = req.user; // From JWT middleware
    const { expertId } = req.params;

    // Verify the supervisor exists and is active
    const supervisor = await Supervisor.findOne({ 
      supervisorId, 
      isActive: true 
    });

    if (!supervisor) {
      return res.status(404).json({
        success: false,
        message: 'Supervisor not found or inactive'
      });
    }

    // Verify the expert exists and is assigned to this supervisor
    const expert = await Expert.findOne({ 
      expertId,
      supervisorId,
      isActive: true 
    });

    if (!expert) {
      return res.status(404).json({
        success: false,
        message: 'Expert not found or not assigned to this supervisor'
      });
    }

    // Remove expert from supervisor
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { $unset: { supervisorId: 1 } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Expert removed from supervisor successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Remove expert from supervisor error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 