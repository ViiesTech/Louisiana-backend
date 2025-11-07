import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../types";

const AdminSchema = new Schema<IAdmin>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
}, { timestamps: true });

export const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);
