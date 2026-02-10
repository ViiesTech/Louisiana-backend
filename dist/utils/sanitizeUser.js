"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUser = void 0;
const sanitizeUser = (user, options = {}) => {
    const { keep = [], remove = [] } = options;
    const userObj = typeof user.toObject === "function"
        ? user.toObject() : { ...user };
    const defaultSensitiveFields = ["password", "otpCode", "otpExpiresAt", '__v'];
    const fieldsToRemove = [...new Set([...defaultSensitiveFields, ...remove])];
    for (const field of fieldsToRemove) {
        if (!keep.includes(field)) {
            delete userObj[field];
        }
    }
    return userObj;
};
exports.sanitizeUser = sanitizeUser;
