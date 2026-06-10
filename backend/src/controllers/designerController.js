const DesignerProfile = require("../models/DesignerProfile");

/**
 * Create Designer Profile
 * POST /api/designers/profile
 * Access: Designer Only
 */
const createDesignerProfile = async (req, res, next) => {
  try {
    const {
      bio,
      location,
      style,
      experience,
      specialization,
      phone,
      profileImage,
      isAvailable,
    } = req.body;

    const existingProfile = await DesignerProfile.findOne({
      userId: req.user.userId,
    });

    if (existingProfile) {
      return res.status(409).json({
        success: false,
        message: "Designer profile already exists",
      });
    }

    const profile = await DesignerProfile.create({
      userId: req.user.userId,
      bio,
      location,
      style,
      experience,
      specialization,
      phone,
      profileImage,
      isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Designer profile created successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Logged In Designer Profile
 * GET /api/designers/profile/me
 */
const getMyProfile = async (req, res, next) => {
  try {
    const profile = await DesignerProfile.findOne({
      userId: req.user.userId,
    }).populate("userId", "name email role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Designer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Designer Profile By ID
 * GET /api/designers/profile/:id
 */
const getDesignerProfileById = async (req, res, next) => {
  try {
    const profile = await DesignerProfile.findById(
      req.params.id
    ).populate("userId", "name email role");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Designer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update Designer Profile
 * PUT /api/designers/profile
 */
const updateDesignerProfile = async (req, res, next) => {
  try {
    const profile = await DesignerProfile.findOne({
      userId: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Designer profile not found",
      });
    }

    const fieldsToUpdate = [
      "bio",
      "location",
      "style",
      "experience",
      "specialization",
      "phone",
      "profileImage",
      "isAvailable",
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    await profile.save();

    return res.status(200).json({
      success: true,
      message: "Designer profile updated successfully",
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Designer Profile
 * DELETE /api/designers/profile
 */
const deleteDesignerProfile = async (req, res, next) => {
  try {
    const profile = await DesignerProfile.findOneAndDelete({
      userId: req.user.userId,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Designer profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Designer profile deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDesignerProfile,
  getMyProfile,
  getDesignerProfileById,
  updateDesignerProfile,
  deleteDesignerProfile,
};