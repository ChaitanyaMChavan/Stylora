const express = require("express");

const {
  createReview,
  getDesignerReviews,
  getDesignerRating,
  getMyReviews,
} = require(
  "../controllers/reviewController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.post(
  "/",
  protect,
  createReview
);

router.get(
  "/my-reviews",
  protect,
  getMyReviews
);

router.get(
  "/designer/:designerId",
  getDesignerReviews
);

router.get(
  "/designer/:designerId/rating",
  getDesignerRating
);

module.exports = router;