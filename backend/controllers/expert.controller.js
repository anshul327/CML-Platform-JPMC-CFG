import Expert from '../models/Expert.js';
import CRP from '../models/CRP.js';
import Farmer from '../models/Farmer.js';

// Create a new expert review
export const createExpert = async (req, res, next) => {
    try {
        const newExpert = new Expert(req.body);
        const savedExpert = await newExpert.save();
        res.status(201).json({
            success: true,
            data: savedExpert
        });
    } catch (error) {
        next(error);
    }
};

// Get all expert reviews
export const getExperts = async (req, res, next) => {
    try {
        const experts = await Expert.find();
        res.status(200).json({
            success: true,
            count: experts.length,
            data: experts
        });
    } catch (error) {
        next(error);
    }
};

// Get expert review by ID
export const getExpertById = async (req, res, next) => {
    try {
        const expert = await Expert.findById(req.params.id);
        if (!expert) {
            return res.status(404).json({
                success: false,
                message: 'Expert review not found'
            });
        }
        res.status(200).json({
            success: true,
            data: expert
        });
    } catch (error) {
        next(error);
    }
};

// Update expert review
export const updateExpert = async (req, res, next) => {
    try {
        const updatedExpert = await Expert.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedExpert) {
            return res.status(404).json({
                success: false,
                message: 'Expert review not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedExpert
        });
    } catch (error) {
        next(error);
    }
};

// Delete expert review
export const deleteExpert = async (req, res, next) => {
    try {
        const deletedExpert = await Expert.findByIdAndDelete(req.params.id);
        if (!deletedExpert) {
            return res.status(404).json({
                success: false,
                message: 'Expert review not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Expert review deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

// Get all CRPs linked to the authenticated Expert
export const getCRPsUnderExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware

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

    // Get all CRPs linked to this expert
    const crps = await CRP.find({ 
      crpId: { $in: expert.linkedCrpId ? [expert.linkedCrpId] : [] },
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'CRPs retrieved successfully',
      data: {
        expertId: expert.expertId,
        expertName: expert.expertName,
        totalCRPs: crps.length,
        crps: crps
      }
    });

  } catch (error) {
    console.error('Get CRPs under expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get all Farmers under the authenticated Expert
export const getFarmersUnderExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware

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

    // Get all farmers assigned to this expert
    const farmers = await Farmer.find({ 
      farmerId: { $in: expert.farmerIds },
      isActive: true 
    }).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmers retrieved successfully',
      data: {
        expertId: expert.expertId,
        expertName: expert.expertName,
        totalFarmers: farmers.length,
        farmers: farmers
      }
    });

  } catch (error) {
    console.error('Get farmers under expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Get Expert Dashboard
export const getExpertDashboard = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware

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

    // Get counts
    const crpsCount = expert.linkedCrpId ? 1 : 0;
    const farmersCount = expert.farmerIds.length;
    const recommendationsCount = expert.suggestedBestPractices.length;
    const resourceNeedsCount = expert.resourceNeeds.length;

    // Get recent activities
    const recentFarmers = await Farmer.find({ 
      farmerId: { $in: expert.farmerIds.slice(0, 5) },
      isActive: true 
    })
    .select('fullName village district cropGrown')
    .limit(5);

    res.status(200).json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: {
        expertId: expert.expertId,
        expertName: expert.expertName,
        specialization: expert.specialization,
        statistics: {
          totalCRPs: crpsCount,
          totalFarmers: farmersCount,
          totalRecommendations: recommendationsCount,
          totalResourceNeeds: resourceNeedsCount,
          followUpRequired: expert.followUpRequired
        },
        recentActivities: {
          recentFarmers: recentFarmers
        }
      }
    });

  } catch (error) {
    console.error('Get expert dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Link CRP to Expert
export const linkCRPToExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware
    const { crpId } = req.body;

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

    // Check if CRP is already linked to another expert
    const existingExpert = await Expert.findOne({ 
      linkedCrpId: crpId,
      expertId: { $ne: expertId },
      isActive: true 
    });

    if (existingExpert) {
      return res.status(400).json({
        success: false,
        message: 'CRP is already linked to another expert'
      });
    }

    // Link CRP to expert
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { linkedCrpId: crpId },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'CRP linked to expert successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Link CRP to expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Unlink CRP from Expert
export const unlinkCRPFromExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware

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

    // Unlink CRP from expert
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { $unset: { linkedCrpId: 1 } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'CRP unlinked from expert successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Unlink CRP from expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Add Farmer to Expert
export const addFarmerToExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware
    const { farmerId } = req.body;

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

    // Check if farmer is already assigned to this expert
    if (expert.farmerIds.includes(farmerId)) {
      return res.status(400).json({
        success: false,
        message: 'Farmer is already assigned to this expert'
      });
    }

    // Add farmer to expert
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { $push: { farmerIds: farmerId } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmer added to expert successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Add farmer to expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Remove Farmer from Expert
export const removeFarmerFromExpert = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware
    const { farmerId } = req.params;

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

    // Check if farmer is assigned to this expert
    if (!expert.farmerIds.includes(farmerId)) {
      return res.status(400).json({
        success: false,
        message: 'Farmer is not assigned to this expert'
      });
    }

    // Remove farmer from expert
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { $pull: { farmerIds: farmerId } },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Farmer removed from expert successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Remove farmer from expert error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update Expert Recommendations
export const updateExpertRecommendations = async (req, res) => {
  try {
    const { expertId } = req.user; // From JWT middleware
    const { 
      suggestedBestPractices, 
      seasonalRecommendations, 
      resourceNeeds, 
      followUpRequired 
    } = req.body;

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

    // Update expert recommendations
    const updatedExpert = await Expert.findOneAndUpdate(
      { expertId },
      { 
        suggestedBestPractices, 
        seasonalRecommendations, 
        resourceNeeds, 
        followUpRequired,
        dateOfReview: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password -loginAttempts -lockUntil');

    res.status(200).json({
      success: true,
      message: 'Expert recommendations updated successfully',
      data: updatedExpert
    });

  } catch (error) {
    console.error('Update expert recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
}; 