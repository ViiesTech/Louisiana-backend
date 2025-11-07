import mongoose from "mongoose";

export interface IGuest extends Document {
    _id?: mongoose.Types.ObjectId;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}