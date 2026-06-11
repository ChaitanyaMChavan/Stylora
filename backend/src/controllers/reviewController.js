const Review = require("../models/Review");
const Appointment = require("../models/Appointment");

/**
 * Create Review
 */
const createReview = async (req, res, next) => {
  try {
    const { appointmentId, rating, comment } =
      req.body;

    const appointment =
      await Appointment.findById(
        appointmentId
      );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (
      appointment.clientId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can review only your appointments",
      });
    }

    if (
      appointment.status !== "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Only completed appointments can be reviewed",
      });
    }

    const existingReview =
      await Review.findOne({
        appointmentId,
      });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message:
          "Review already submitted",
      });
    }

    const review =
      await Review.create({
        clientId:
          appointment.clientId,

        designerId:
          appointment.designerId,

        appointmentId,

        rating,

        comment,
      });

    res.status(201).json({
      success: true,
      review,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get Reviews Of Designer
 */
const getDesignerReviews =
  async (req, res, next) => {
    try {
      const reviews =
        await Review.find({
          designerId:
            req.params.designerId,
        })
          .populate(
            "clientId",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        count: reviews.length,
        reviews,
      });
    } catch (error) {
      next(error);
    }
  };

/**
 * Get Designer Rating Stats
 */
const getDesignerRating =
  async (req, res, next) => {
    try {
      const reviews =
        await Review.find({
          designerId:
            req.params.designerId,
        });

      if (
        reviews.length === 0
      ) {
        return res.status(200).json({
          success: true,
          averageRating: 0,
          totalReviews: 0,
        });
      }

      const totalRating =
        reviews.reduce(
          (sum, review) =>
            sum + review.rating,
          0
        );

      const averageRating =
        totalRating /
        reviews.length;

      res.status(200).json({
        success: true,
        averageRating:
          Number(
            averageRating.toFixed(1)
          ),
        totalReviews:
          reviews.length,
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  createReview,
  getDesignerReviews,
  getDesignerRating,
};