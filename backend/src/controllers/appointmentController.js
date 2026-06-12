const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");

//create appointment
const createAppointment = async (
  req,
  res,
  next
) => {
  try {
    const {
      designerId,
      appointmentDate,
      appointmentTime,
      serviceType,
      notes,
      contactPhone,
      location,
    } = req.body;

    if (
      !designerId ||
      !appointmentDate ||
      !appointmentTime ||
      !serviceType ||
      !contactPhone ||
      !location
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All required fields must be provided",
      });
    }

    if (designerId === req.user.userId) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot book yourself",
      });
    }

    const bookingDate =
      new Date(appointmentDate);

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment date must be in the future",
      });
    }

    const existingSlot =
      await Appointment.findOne({
        designerId,
        appointmentDate,
        appointmentTime,

        status: {
          $nin: [
            "cancelled",
            "rejected",
          ],
        },
      });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message:
          "Designer already booked for this time slot",
      });
    }

    const appointment =
      await Appointment.create({
        clientId: req.user.userId,
        designerId,
        appointmentDate,
        appointmentTime,
        serviceType,
        notes,
        contactPhone,
        location,
      });

      await Notification.create({
  userId: designerId,

  title: "New Appointment Request",

  message:
    "You have received a new appointment request.",

  type: "appointment",
});

    return res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Appointment already exists",
      });
    }

    next(error);
  }
};

//get appointments for client
const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      clientId: req.user.userId,
    })
      .populate("designerId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

//get appointments for designer
const getDesignerAppointments = async (
  req,
  res,
  next
) => {
  try {
    const appointments = await Appointment.find({
      designerId: req.user.userId,
    })
      .populate("clientId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

//get appointment by id
const getAppointmentById = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      )
        .populate("clientId", "name email")
        .populate("designerId", "name email");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const userId = req.user.userId;

    const isOwner =
      appointment.clientId._id.toString() ===
        userId ||
      appointment.designerId._id.toString() ===
        userId;

    if (!isOwner) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//accept appointment
const acceptAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access",
      });
    }

    if (
      !canTransition(
        appointment.status,
        "accepted"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to accepted`,
      });
    }

    appointment.status = "accepted";

    await appointment.save();

    await Notification.create({
  userId: appointment.clientId,

  title: "Appointment Accepted",

  message:
    "Your appointment request has been accepted.",

  type: "appointment",
});

    return res.status(200).json({
      success: true,
      message:
        "Appointment accepted successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//reject appointment
const rejectAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access",
      });
    }

    if (
      !canTransition(
        appointment.status,
        "rejected"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to rejected`,
      });
    }

    appointment.status = "rejected";

    await appointment.save();

    await Notification.create({
  userId: appointment.clientId,

  title: "Appointment Rejected",

  message:
    "Your appointment request has been rejected.",

  type: "appointment",
});

    return res.status(200).json({
      success: true,
      message:
        "Appointment rejected successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//complete appointment
const completeAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.designerId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access",
      });
    }

    if (
      !canTransition(
        appointment.status,
        "completed"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to completed`,
      });
    }

    appointment.status = "completed";

    await appointment.save();

    await Notification.create({
  userId: appointment.clientId,

  title: "Appointment Completed",

  message:
    "Your appointment has been completed.",

  type: "appointment",
});

    return res.status(200).json({
      success: true,
      message:
        "Appointment completed successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//cancel appointment
const cancelAppointment = async (
  req,
  res,
  next
) => {
  try {
    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    const userId =
      req.user.userId;

    const allowed =
      appointment.clientId.toString() ===
        userId ||
      appointment.designerId.toString() ===
        userId;

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message:
          "Unauthorized access",
      });
    }

    if (
      !canTransition(
        appointment.status,
        "cancelled"
      )
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot change appointment from ${appointment.status} to cancelled`,
      });
    }

    appointment.status =
      "cancelled";

    appointment.cancellationReason =
      req.body.reason || "";

    await appointment.save();

    const targetUser =
appointment.clientId.toString() ===
req.user.userId
  ? appointment.designerId
  : appointment.clientId;

await Notification.create({
  userId: targetUser,

  title: "Appointment Cancelled",

  message:
    "An appointment has been cancelled.",

  type: "appointment",
});

    return res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

//valid_Transitions 
const VALID_TRANSITIONS = {
  pending: ["accepted", "rejected", "cancelled"],
  accepted: ["completed", "cancelled"],
  rejected: [],
  completed: [],
  cancelled: [],
};

const canTransition = (currentStatus, nextStatus) => {
  return VALID_TRANSITIONS[currentStatus]?.includes(
    nextStatus
  );
};

//mark appointment as paid
const markAppointmentPaid =
async (req, res, next) => {
  try {

    const appointment =
      await Appointment.findById(
        req.params.id
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message:
          "Appointment not found",
      });
    }

    if (
      appointment.clientId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Only client can mark payment",
      });
    }

    const { amount } = req.body;

    appointment.paymentStatus =
      "paid";

    appointment.paymentAmount =
      amount;

    appointment.paymentDate =
      new Date();

    await appointment.save();

    res.status(200).json({
      success: true,
      message:
        "Payment marked successfully",
      appointment,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
  getDesignerAppointments,
  getAppointmentById,
  acceptAppointment,
  rejectAppointment,
  completeAppointment,
  cancelAppointment,
  canTransition,
  markAppointmentPaid,
};