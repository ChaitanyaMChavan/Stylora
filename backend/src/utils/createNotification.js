const Notification = require("../models/Notification");

const createNotification = async (
    userId,
    message
) => {
    try {
        await Notification.create({
            userId,
            message,
        });
    } catch (error) {
        console.error(
            "Notification creation failed:",
            error.message
        );
    }
};

module.exports = createNotification;