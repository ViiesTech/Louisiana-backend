import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    profile: { type: String, default: "" },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
    personalization: { type: [String], default: [] },
    cityReview: [{ type: Schema.Types.ObjectId, ref: "CityReview", default: [] }],
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", UserSchema);
