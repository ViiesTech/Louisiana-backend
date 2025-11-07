import { IUser, SanitizeOptions } from "../types";

export const sanitizeUser = (user: IUser, options: SanitizeOptions = {}) => {
    const { keep = [], remove = [] } = options;

    const userObj = typeof (user as any).toObject === "function"
        ? (user as any).toObject() : { ...user };

    const defaultSensitiveFields = ["password", "otpCode", "otpExpiresAt" , '__v'];

    const fieldsToRemove = [...new Set([...defaultSensitiveFields, ...remove])];

    for (const field of fieldsToRemove) {
        if (!keep.includes(field)) {
            delete userObj[field];
        }
    }

    return userObj;
};
