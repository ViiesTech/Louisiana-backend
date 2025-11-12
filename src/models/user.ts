import mongoose, { Schema } from "mongoose";
import { IUser } from "../types";

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },
    profile: { type: String, default: "" },
    otpCode: { type: String, default: "" },
    otpExpiresAt: { type: Date, default: null },
    personalization: { type: [String], default: [] },
    favouriteCities: [{ type: Schema.Types.ObjectId, ref: "City", default: [] }],
    visitedCities: [{ type: Schema.Types.ObjectId, ref: "City", default: [] }],
    favouriteBusinesses: [{ type: Schema.Types.ObjectId, ref: "Business", default: [] }],
    cityReview: [{ type: Schema.Types.ObjectId, ref: "CityReview", default: [] }],
    businessReview: [{ type: Schema.Types.ObjectId, ref: "BusinessReview", default: [] }],
    itineraries: [{ type: Schema.Types.ObjectId, ref: "Itineraries", default: [] }],
    notifications: [{ type: Schema.Types.ObjectId, ref: "Notification", default: [] }],
}, { timestamps: true });

UserSchema.index({ location: "2dsphere" });

export const User = mongoose.model<IUser>("User", UserSchema);
