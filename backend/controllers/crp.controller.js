import CRP from '../models/CRP.js';
import Farmer from '../models/Farmer.js';

// Create a new CRP report
export const createCRP = async (req, res, next) => {
    try {
        const newCRP = new CRP(req.body);
        const savedCRP = await newCRP.save();
        res.status(201).json({
            success: true,
            data: savedCRP
        });
    } catch (error) {
        next(error);
    }
};

// Get all CRP reports
export const getCRPs = async (req, res, next) => {
    try {
        const crps = await CRP.find();
        res.status(200).json({
            success: true,
            count: crps.length,
            data: crps
        });
    } catch (error) {
        next(error);
    }
};

// Get CRP by ID
export const getCRPById = async (req, res, next) => {
    try {
        const crp = await CRP.findById(req.params.id);
        if (!crp) {
            return res.status(404).json({
                success: false,
                message: 'CRP report not found'
            });
        }
        res.status(200).json({
            success: true,
            data: crp
        });
    } catch (error) {
        next(error);
    }
};

// Update CRP
export const updateCRP = async (req, res, next) => {
    try {
        const updatedCRP = await CRP.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCRP) {
            return res.status(404).json({
                success: false,
                message: 'CRP report not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedCRP
        });
    } catch (error) {
        next(error);
    }
};

// Delete CRP
export const deleteCRP = async (req, res, next) => {
    try {
        const deletedCRP = await CRP.findByIdAndDelete(req.params.id);
        if (!deletedCRP) {
            return res.status(404).json({
                success: false,
                message: 'CRP report not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'CRP report deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get all Farmers under the authenticated CRP
export const getFarmersUnderCRP = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Get all farmers assigned to this CRP
    const farmers = await Farmer.find({ 
      farmerId: { $in: crp.farmerIds },
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmers retrieved successfully',
      data: {
        crpId: crp.crpId,
        crpName: crp.crpName,
        totalFarmers: farmers.length,
        farmers: farmers
      }
    });

  } catch (error) {
    console.error('Get farmers under CRP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get CRP Dashboard
export const getCRPDashboard = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Get counts
    const farmersCount = crp.farmerIds.length;
    const interventionsCount = crp.interventionsGiven.length;
    const issuesCount = crp.summaryOfFarmerIssues ? 1 : 0;

    // Get recent activities
    const recentFarmers = await Farmer.find({ 
      farmerId: { $in: crp.farmerIds.slice(0, 5) },
      isActive: true 
    })
    .select('fullName village district cropGrown')
    .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        crpId: crp.crpId,
        crpName: crp.crpName,
        district: crp.district,
        state: crp.state,
        statistics: {
          totalFarmers: farmersCount,
          totalInterventions: interventionsCount,
          totalIssues: issuesCount,
          dateOfVisit: crp.dateOfVisit
        },
        recentActivities: {
          recentFarmers: recentFarmers
        }
      }
    });

  } catch (error) {
    console.error('Get CRP dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Add Farmer to CRP
export const addFarmerToCRP = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { farmerId } = req.body;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Verify the farmer exists and is active
    const farmer = await Farmer.findOne({ 
      farmerId,
      isActive: true 
    });

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found or inactive'
      });
    }

    // Check if farmer is already assigned to this CRP
    if (crp.farmerIds.includes(farmerId)) {
      return res.status(400).json({
        success: false,
        message: 'Farmer is already assigned to this CRP'
      });
    }

    // Add farmer to CRP
    const updatedCRP = await CRP.findOneAndUpdate(
      { crpId },
      { $push: { farmerIds: farmerId } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmer added to CRP successfully',
      data: updatedCRP
    });

  } catch (error) {
    console.error('Add farmer to CRP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Remove Farmer from CRP
export const removeFarmerFromCRP = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { farmerId } = req.params;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Check if farmer is assigned to this CRP
    if (!crp.farmerIds.includes(farmerId)) {
      return res.status(400).json({
        success: false,
        message: 'Farmer is not assigned to this CRP'
      });
    }

    // Remove farmer from CRP
    const updatedCRP = await CRP.findOneAndUpdate(
      { crpId },
      { $pull: { farmerIds: farmerId } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmer removed from CRP successfully',
      data: updatedCRP
    });

  } catch (error) {
    console.error('Remove farmer from CRP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update CRP Visit Report
export const updateCRPVisitReport = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { 
      dateOfVisit, 
      summaryOfFarmerIssues, 
      interventionsGiven, 
      notesForExpert 
    } = req.body;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Update CRP visit report
    const updatedCRP = await CRP.findOneAndUpdate(
      { crpId },
      { 
        dateOfVisit: dateOfVisit || new Date(),
        summaryOfFarmerIssues, 
        interventionsGiven, 
        notesForExpert
      },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'CRP visit report updated successfully',
      data: updatedCRP
    });

  } catch (error) {
    console.error('Update CRP visit report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Farmer Details by ID
export const getFarmerDetails = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { farmerId } = req.params;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Check if farmer is assigned to this CRP
    if (!crp.farmerIds.includes(farmerId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Farmer not assigned to this CRP'
      });
    }

    // Get farmer details
    const farmer = await Farmer.findOne({ 
      farmerId,
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: 'Farmer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Farmer details retrieved successfully',
      data: farmer
    });

  } catch (error) {
    console.error('Get farmer details error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Farmers by District
export const getFarmersByDistrict = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { district } = req.params;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Get farmers in the specified district that are assigned to this CRP
    const farmers = await Farmer.find({ 
      farmerId: { $in: crp.farmerIds },
      district: district,
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmers by district retrieved successfully',
      data: {
        crpId: crp.crpId,
        crpName: crp.crpName,
        district: district,
        totalFarmers: farmers.length,
        farmers: farmers
      }
    });

  } catch (error) {
    console.error('Get farmers by district error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Farmers by Crop
export const getFarmersByCrop = async (req, res) => {
  try {
    const { crpId } = req.user; // From JWT middleware
    const { crop } = req.params;

    // Verify the CRP exists and is active
    const crp = await CRP.findOne({ 
      crpId, 
      isActive: true 
    });

    if (!crp) {
      return res.status(404).json({
        success: false,
        message: 'CRP not found or inactive'
      });
    }

    // Get farmers growing the specified crop that are assigned to this CRP
    const farmers = await Farmer.find({ 
      farmerId: { $in: crp.farmerIds },
      cropGrown: crop,
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmers by crop retrieved successfully',
      data: {
        crpId: crp.crpId,
        crpName: crp.crpName,
        crop: crop,
        totalFarmers: farmers.length,
        farmers: farmers
      }
    });

  } catch (error) {
    console.error('Get farmers by crop error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 