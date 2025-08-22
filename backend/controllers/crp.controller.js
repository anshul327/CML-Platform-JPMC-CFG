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

// Add a new training instance and (optionally) link to a CRP
export const addTraining = async (req, res, next) => {
    try {
        const { subject, attendees, date, crpId } = req.body;

        // Create new training document
        const training = new Training({
            subject,
            attendees
        });
        const savedTraining = await training.save();

        // Optionally link to CRP if crpId and date are provided
        let updatedCRP = null;
        if (crpId && date) {
            updatedCRP = await CRP.findOneAndUpdate(
                { crpId },
                {
                    $push: {
                        trainingsConducted: {
                            trainingId: savedTraining._id,
                            date,
                            subject,
                            attendees
                        }
                    }
                },
                { new: true }
            );
        }

        res.status(201).json({
            success: true,
            message: 'Training added successfully',
            training: savedTraining,
            crp: updatedCRP
        });
    } catch (error) {
        next(error);
    }
};

// Edit a training instance and update CRP reference
export const editTraining = async (req, res, next) => {
    try {
        const { trainingId } = req.params;
        const { subject, attendees, date, crpId } = req.body;

        // Update training document
        const updatedTraining = await Training.findByIdAndUpdate(
            trainingId,
            { subject, attendees },
            { new: true, runValidators: true }
        );

        if (!updatedTraining) {
            return res.status(404).json({
                success: false,
                message: 'Training not found'
            });
        }

        // Update CRP's trainingsConducted array if crpId and date are provided
        let updatedCRP = null;
        if (crpId && date) {
            updatedCRP = await CRP.findOneAndUpdate(
                { crpId, "trainingsConducted.trainingId": trainingId },
                {
                    $set: {
                        "trainingsConducted.$.subject": subject,
                        "trainingsConducted.$.attendees": attendees,
                        "trainingsConducted.$.date": date
                    }
                },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Training updated successfully',
            training: updatedTraining,
            crp: updatedCRP
        });
    } catch (error) {
        next(error);
    }
};

// Delete a training instance and remove from CRP reference
export const deleteTraining = async (req, res, next) => {
    try {
        const { trainingId } = req.params;
        const { crpId } = req.body;

        // Delete training document
        const deletedTraining = await Training.findByIdAndDelete(trainingId);

        if (!deletedTraining) {
            return res.status(404).json({
                success: false,
                message: 'Training not found'
            });
        }

        // Remove training from CRP's trainingsConducted array if crpId is provided
        let updatedCRP = null;
        if (crpId) {
            updatedCRP = await CRP.findOneAndUpdate(
                { crpId },
                { $pull: { trainingsConducted: { trainingId } } },
                { new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: 'Training deleted successfully',
            training: deletedTraining,
            crp: updatedCRP
        });
    } catch (error) {
        next(error);
    }
};

// Add a new problem instance
export const addProblem = async (req, res, next) => {
    try {
        const { issue, description, solved, farmerId, image, video } = req.body;
        const problem = new Problem({
            issue,
            description,
            solved,
            farmerId,
            image,
            video
        });
        const savedProblem = await problem.save();
        res.status(201).json({
            success: true,
            message: 'Problem added successfully',
            problem: savedProblem
        });
    } catch (error) {
        next(error);
    }
};

// Edit a problem instance
export const editProblem = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const { issue, description, solved, farmerId, image, video } = req.body;
        const updatedProblem = await Problem.findByIdAndUpdate(
            problemId,
            { issue, description, solved, farmerId, image, video },
            { new: true, runValidators: true }
        );
        if (!updatedProblem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Problem updated successfully',
            problem: updatedProblem
        });
    } catch (error) {
        next(error);
    }
};

// Delete a problem instance
export const deleteProblem = async (req, res, next) => {
    try {
        const { problemId } = req.params;
        const deletedProblem = await Problem.findByIdAndDelete(problemId);
        if (!deletedProblem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully',
            problem: deletedProblem
        });
    } catch (error) {
        next(error);
    }
};