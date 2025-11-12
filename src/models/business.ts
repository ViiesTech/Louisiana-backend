import mongoose, { Schema } from "mongoose";
import { IBusiness, IHour } from "../types";

const HourSchema = new Schema<IHour>({
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",], required: true
    },
    open: { type: String },
    close: { type: String },
    isClosed: { type: Boolean, default: false },
});

const BusinessSchema = new Schema<IBusiness>({
    name: { type: String },
    category: { type: String },
    description: { type: String },
    address: { type: String },
    phone: { type: Number },
    email: { type: String, unique: true },
    website: { type: String },
    hours: [HourSchema],
    location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] }
    },
    status: { type: String, enum: ['Active', 'Inactive'] },
    review: [{ type: Schema.Types.ObjectId, ref: "BusinessReview", default: [] }],
    gallery: { type: [String], default: [] }
}, { timestamps: true });

BusinessSchema.index({ location: "2dsphere" });

export const Business = mongoose.model("Business", BusinessSchema);
