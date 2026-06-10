const express = require("express");

const {
  createPortfolio,
  getMyPortfolios,
  getPortfolioById,
  getDesignerPortfolios,
  updatePortfolio,
  deletePortfolio,
} = require("../controllers/portfolioController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * Create Portfolio
 * Designer Only
 */
router.post(
  "/",
  protect,
  authorize("designer"),
  createPortfolio
);

/**
 * Get Logged-In Designer Portfolios
 */
router.get(
  "/my",
  protect,
  authorize("designer"),
  getMyPortfolios
);

/**
 * Public - Get Portfolios By Designer
 */
router.get(
  "/designer/:designerId",
  getDesignerPortfolios
);

/**
 * Public - Get Single Portfolio
 */
router.get(
  "/:portfolioId",
  getPortfolioById
);

/**
 * Update Portfolio
 * Owner Only
 */
router.put(
  "/:portfolioId",
  protect,
  authorize("designer"),
  updatePortfolio
);

/**
 * Delete Portfolio
 * Owner Only
 */
router.delete(
  "/:portfolioId",
  protect,
  authorize("designer"),
  deletePortfolio
);

module.exports = router;