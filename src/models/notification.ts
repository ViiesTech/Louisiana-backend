import mongoose from "mongoose";
import { INotification } from "../types";

const NotificationSchema = new mongoose.Schema<INotification>({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String },
    title: { type: String, required: true },
    description: { type: String, required: true },
    data: { type: Object , default: null },
    isRead: { type: Boolean, default: false }
}, { timestamps: true });

export const Notification = mongoose.model<INotification>("Notification", NotificationSchema);