const Notification = require("../models/Notification");

/**
 * Get logged-in user's notifications
 */
const getMyNotifications = async (
  req,
  res,
  next
) => {
  try {
    const notifications =
      await Notification.find({
        userId: req.user.userId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark single notification as read
 */
const markNotificationRead = async (
  req,
  res,
  next
) => {
  try {
    const notification =
      await Notification.findById(
        req.params.id
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    if (
      notification.userId.toString() !==
      req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    notification.isRead = true;

    await notification.save();

    res.status(200).json({
      success: true,
      message:
        "Notification marked as read",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark all notifications as read
 */
const markAllNotificationsRead =
  async (req, res, next) => {
    try {
      await Notification.updateMany(
        {
          userId: req.user.userId,
          isRead: false,
        },
        {
          isRead: true,
        }
      );

      res.status(200).json({
        success: true,
        message:
          "All notifications marked as read",
      });
    } catch (error) {
      next(error);
    }
  };

module.exports = {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};