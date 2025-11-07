
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    latitude?: number | null;
    longitude?: number | null;
    profile: String;
    personalization: string[];
    createdAt?: Date;
    updatedAt?: Date;
}