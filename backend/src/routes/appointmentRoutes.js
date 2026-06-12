const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getDesignerAppointments,
  getAppointmentById,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  markAppointmentPaid,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

const router = express.Router();

/**
 * CLIENT ROUTES
 */

// Create Appointment
router.post(
  "/",
  protect,
  authorize("client"),
  createAppointment
);

// View My Appointments
router.get(
  "/my",
  protect,
  authorize("client"),
  getMyAppointments
);

/**
 * DESIGNER ROUTES
 */

// Incoming Appointment Requests
router.get(
  "/designer",
  protect,
  authorize("designer"),
  getDesignerAppointments
);

// Accept
router.put(
  "/:id/accept",
  protect,
  authorize("designer"),
  acceptAppointment
);

// Reject
router.put(
  "/:id/reject",
  protect,
  authorize("designer"),
  rejectAppointment
);

// Complete
router.put(
  "/:id/complete",
  protect,
  authorize("designer"),
  completeAppointment
);

/**
 * SHARED ROUTES
 */

// Appointment Details
router.get(
  "/:id",
  protect,
  getAppointmentById
);

// Cancel
router.put(
  "/:id/cancel",
  protect,
  cancelAppointment
);

// Mark as Paid
router.put(
  "/:id/pay",
  protect,
  markAppointmentPaid
);

module.exports = router;