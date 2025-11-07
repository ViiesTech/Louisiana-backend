import mongoose, { Schema } from "mongoose";
import { IGuest } from "../types";

const GuestSchema = new Schema<IGuest>({
    email: { type: String, required: true, unique: true },
}, { timestamps: true });

export const Guest = mongoose.model<IGuest>("Guest", GuestSchema);
