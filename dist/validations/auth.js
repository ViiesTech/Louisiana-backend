"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestValidation = exports.resetPasswordValidation = exports.verifyOtpValidation = exports.forgotPasswordValidation = exports.signinValidation = exports.signupValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.signupValidation = joi_1.default.object({
    username: joi_1.default.string().max(50).required().messages({
        "any.required": "*Username is required",
        "string.empty": "*Username is required.",
    }),
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required.",
        "string.email": "*Please provide a valid email address.",
    }),
    password: joi_1.default.string().min(6).max(100).required().messages({
        "any.required": "*Password is required",
        "string.empty": "*Password is required.",
        "string.min": "*Password must be at least 6 characters long.",
    }),
    latitude: joi_1.default.number().optional().allow(null),
    longitude: joi_1.default.number().optional().allow(null),
    profile: joi_1.default.string().optional().allow(""),
    personalization: joi_1.default.array().items(joi_1.default.string()).optional(),
});
exports.signinValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required.",
        "string.email": "*Please provide a valid email address.",
    }),
    password: joi_1.default.string().min(6).max(100).required().messages({
        "any.required": "*Password is required",
        "string.empty": "*Password is required.",
        "string.min": "*Password must be at least 6 characters long.",
    }),
});
exports.forgotPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
});
exports.verifyOtpValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
    otp: joi_1.default.alternatives().try(joi_1.default.string().trim(), joi_1.default.number()).required().messages({
        "string.empty": "*OTP is required.",
        "any.required": "*OTP is required.",
    }),
});
exports.resetPasswordValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
    password: joi_1.default.string().min(6).max(30).required().messages({
        "any.required": "*Password is required",
        "string.empty": "*Password is required",
        "string.min": "*Password must be at least 6 characters long",
    }),
    confirmPassword: joi_1.default.string().min(6).max(30).required().messages({
        "any.required": "*Confirm Password is required",
        "string.empty": "*Confirm Password is required",
        "string.min": "*Confirm Password must be at least 6 characters long",
    }),
});
exports.guestValidation = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "any.required": "*Email is required",
        "string.empty": "*Email is required",
        "string.email": "*Please enter a valid email address",
    }),
});
