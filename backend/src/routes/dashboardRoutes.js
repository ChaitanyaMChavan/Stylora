const express = require("express");

const {
  getDesignerDashboard,
  getClientDashboard,
} = require(
  "../controllers/dashboardController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/designer",
  protect,
  getDesignerDashboard
);

router.get(
  "/client",
  protect,
  getClientDashboard
);

module.exports = router;