const express = require("express");

const {
  createDesignerProfile,
  getMyProfile,
  getDesignerProfileById,
  updateDesignerProfile,
  deleteDesignerProfile,
  getAllDesigners,
} = require("../controllers/designerController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

router.route("/").get(getAllDesigners);

/**
 * Create Designer Profile
 */
router.post(
  "/profile",
  protect,
  authorize("designer"),
  createDesignerProfile
);

/**
 * Get Logged In Designer Profile
 */
router.get(
  "/profile/me",
  protect,
  authorize("designer"),
  getMyProfile
);

/**
 * Public Designer Profile
 */
router.get(
  "/profile/:id",
  getDesignerProfileById
);

/**
 * Update Designer Profile
 */
router.put(
  "/profile",
  protect,
  authorize("designer"),
  updateDesignerProfile
);

/**
 * Delete Designer Profile
 */
router.delete(
  "/profile",
  protect,
  authorize("designer"),
  deleteDesignerProfile
);

module.exports = router;