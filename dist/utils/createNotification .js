"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = void 0;
const notification_1 = require("../models/notification");
const user_1 = require("../models/user");
const createNotification = async (params) => {
    try {
        const { userId, title, description, category, data } = params;
        const notification = await notification_1.Notification.create({
            user: userId, title, description,
            category: category || "info",
            data
        });
        await user_1.User.findByIdAndUpdate(userId, { $push: { notifications: notification._id } }, { new: true });
    }
    catch (error) {
        console.error("Error creating notification:", error);
    }
};
exports.createNotification = createNotification;
