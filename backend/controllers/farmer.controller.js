import Farmer from '../models/Farmer.js';

// Create a new farmer
export const createFarmer = async (req, res, next) => {
    try {
        const newFarmer = new Farmer(req.body);
        const savedFarmer = await newFarmer.save();
        res.status(201).json({
            success: true,
            data: savedFarmer
        });
    } catch (error) {
        next(error);
    }
};

// Get all farmers
export const getFarmers = async (req, res, next) => {
    try {
        const farmers = await Farmer.find();
        res.status(200).json({
            success: true,
            count: farmers.length,
            data: farmers
        });
    } catch (error) {
        next(error);
    }
};

// Get farmer by ID
export const getFarmerById = async (req, res, next) => {
    try {
        const farmer = await Farmer.findById(req.params.id);
        if (!farmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: farmer
        });
    } catch (error) {
        next(error);
    }
};

// Update farmer
export const updateFarmer = async (req, res, next) => {
    try {
        const updatedFarmer = await Farmer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedFarmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.status(200).json({
            success: true,
            data: updatedFarmer
        });
    } catch (error) {
        next(error);
    }
};

// Delete farmer
export const deleteFarmer = async (req, res, next) => {
    try {
        const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
        if (!deletedFarmer) {
            return res.status(404).json({
                success: false,
                message: 'Farmer not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Farmer deleted successfully'
        });
    } catch (error) {
        next(error);
    }
}; 