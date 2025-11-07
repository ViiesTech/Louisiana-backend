import mongoose from "mongoose";

export interface ICity extends Document {
    _id?: mongoose.Types.ObjectId; 
    name: string;
    type: string;
    description?: string;
    history?: string;
    address?: string;
    phone?: number;
    website?: string;
    hours?: string;
    latitude?: number | null;
    longitude?: number | null;
    review: mongoose.Types.ObjectId[];
    gallery: string[];
    touristSpot: mongoose.Types.ObjectId[];
    createdAt?: Date;
    updatedAt?: Date;
}
