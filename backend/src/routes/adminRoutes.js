const express = require("express");

const {
    getAdminDashboard,
    getAllUsers,
    getAllDesigners,
    getAllAppointments,
    getAllReviews,
} = require(
    "../controllers/adminController"
);

const {
    protect,
} = require(
    "../middleware/authMiddleware"
);

const adminOnly = require(
    "../middleware/adminMiddleware"
);

const router = express.Router();

router.get(
    "/dashboard",
    protect,
    adminOnly,
    getAdminDashboard
);
router.get(
    "/users",
    protect,
    adminOnly,
    getAllUsers
);

router.get(
    "/designers",
    protect,
    adminOnly,
    getAllDesigners
);

router.get(
    "/appointments",
    protect,
    adminOnly,
    getAllAppointments
);

router.get(
    "/reviews",
    protect,
    adminOnly,
    getAllReviews
);

module.exports = router;