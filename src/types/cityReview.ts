import { Types } from "mongoose";

export interface ICityReview {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    city: Types.ObjectId;
    rating: number;
    comment: string;
    createdAt?: Date;
    updatedAt?: Date;
}
