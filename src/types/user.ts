import mongoose from "mongoose";

export interface IUser extends Document {
    _id?: mongoose.Types.ObjectId;
    username: string;
    email: string;
    password: string;
    latitude?: number | null;
    longitude?: number | null;
    profile: String;
    personalization: string[];
    otpCode?: string;
    otpExpiresAt?: Date;
    cityReview?: mongoose.Types.ObjectId[];
    businessReview: mongoose.Types.ObjectId[];
    favouriteCities: mongoose.Types.ObjectId[];
    visitedCities: mongoose.Types.ObjectId[];
    favouriteBusinesses: mongoose.Types.ObjectId[];
    itineraries: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}