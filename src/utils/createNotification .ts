import { CreateNotificationParams } from "../types";
import { Notification } from "../models/notification";
import { User } from "../models/user";

export const createNotification = async (params: CreateNotificationParams): Promise<void> => {
    try {
        const { userId, title, description, category, data } = params;

        const notification = await Notification.create({
            user: userId, title, description,
            category: category || "info",
            data
        });

        await User.findByIdAndUpdate(
            userId, { $push: { notifications: notification._id } }, { new: true }
        );
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};