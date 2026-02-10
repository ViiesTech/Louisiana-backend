"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassValidation = exports.createItineraryValidation = exports.cityReviewValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.cityReviewValidation = joi_1.default.object({
    rating: joi_1.default.number().min(1).max(5).required().messages({
        "number.base": "Rating must be a number.",
        "number.min": "Rating must be at least 1.",
        "number.max": "Rating cannot be more than 5.",
        "any.required": "Rating is required."
    }),
    comment: joi_1.default.string().required().messages({
        "string.base": "Comment must be a string.",
        "string.empty": "Comment cannot be empty.",
        "any.required": "Comment is required."
    })
});
exports.createItineraryValidation = joi_1.default.object({
    title: joi_1.default.string().required().messages({
        "string.base": "Title must be a string.",
        "string.empty": "Title cannot be empty.",
        "any.required": "Title is required."
    }),
    description: joi_1.default.string().optional().messages({
        "string.base": "Description must be a string."
    }),
    startDate: joi_1.default.string().required().messages({
        "string.base": "Start date must be a string.",
        "string.empty": "Start date cannot be empty.",
        "any.required": "Start date is required."
    }),
    endDate: joi_1.default.string().required().messages({
        "string.base": "End date must be a string.",
        "string.empty": "End date cannot be empty.",
        "any.required": "End date is required."
    }),
    places: joi_1.default.array().items(joi_1.default.object({
        placeId: joi_1.default.string().required().messages({
            "string.base": "Place ID must be a string.",
            "string.empty": "Place ID cannot be empty.",
            "any.required": "Place ID is required."
        }),
        placeModel: joi_1.default.string().required().messages({
            "string.base": "Place model must be a string.",
            "string.empty": "Place model cannot be empty.",
            "any.required": "Place model is required."
        })
    })).required().messages({
        "array.base": "Places must be an array.",
        "any.required": "Places are required."
    })
});
exports.changePassValidation = joi_1.default.object({
    oldPassword: joi_1.default.string().required().messages({
        "any.required": "*oldPassword is required",
        "string.empty": "*oldPassword is required",
    }),
    newPassword: joi_1.default.string().min(6).max(30).required().messages({
        "any.required": "*New password is required",
        "string.min": "*New password must be at least 6 characters long",
    }),
});
