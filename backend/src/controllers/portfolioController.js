const Portfolio = require("../models/Portfolio");
const Designer = require("../models/DesignerProfile");

/**
 * Create Portfolio
 * POST /api/portfolio
 */
const createPortfolio = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      images,
      tags,
      priceRange,
      featured,
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Portfolio title is required",
      });
    }

    const existingPortfolio = await Portfolio.findOne({
      designerId: req.user.userId,
      title: title.trim(),
    });

    if (existingPortfolio) {
      return res.status(409).json({
        success: false,
        message: "Portfolio title already exists",
      });
    }

    const portfolio = await Portfolio.create({
      designerId: req.user.userId,
      title: title.trim(),
      description,
      category,
      images,
      tags,
      priceRange,
      featured,
    });

    return res.status(201).json({
      success: true,
      message: "Portfolio created successfully",
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get My Portfolios
 * GET /api/portfolio/my
 */
const getMyPortfolios = async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find({
      designerId: req.user.userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: portfolios.length,
      portfolios,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Portfolio By ID
 * GET /api/portfolio/:portfolioId
 */
const getPortfolioById = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.portfolioId
    ).populate("designerId", "name email");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Portfolios Of A Designer
 * GET /api/portfolio/designer/:designerId
 */
const getDesignerPortfolios = async (req, res, next) => {
  try {
    const { designerId } = req.params;

    // 1. Safely find the designer profile using the incoming parameter ID
    const designerProfile = await Designer.findById(designerId);
    
    // Safety check: Prevent crashing if the profile doesn't exist
    if (!designerProfile) {
      return res.status(404).json({ 
        success: false, 
        message: "Designer profile not found" 
      });
    }

    // 2. Query portfolios handling both matching ID fallbacks 
    // Checks if portfolios are tied to the User ID OR the Profile ID
    const portfolios = await Portfolio.find({
      $or: [
        { designerId: designerProfile.userId },
        { designerId: designerProfile._id }
      ]
    });

    return res.status(200).json({
      success: true,
      count: portfolios.length,
      portfolios
    });
  } catch (error) {
    next(error); // Securely hands the error over to your global Express handler
  }
};
/**
 * Update Portfolio
 * PUT /api/portfolio/:portfolioId
 */
const updatePortfolio = async (
  req,
  res,
  next
) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.portfolioId
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (
      portfolio.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const fields = [
      "title",
      "description",
      "category",
      "images",
      "tags",
      "priceRange",
      "featured",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        portfolio[field] = req.body[field];
      }
    });

    await portfolio.save();

    return res.status(200).json({
      success: true,
      message: "Portfolio updated successfully",
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Portfolio
 * DELETE /api/portfolio/:portfolioId
 */
const deletePortfolio = async (
  req,
  res,
  next
) => {
  try {
    const portfolio = await Portfolio.findById(
      req.params.portfolioId
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    if (
      portfolio.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    await portfolio.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Portfolio deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getDesignerPortfolios,
  updatePortfolio,
  deletePortfolio,
};