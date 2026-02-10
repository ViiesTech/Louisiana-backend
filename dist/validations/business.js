"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.businessHoursValidation = exports.addBusinessValidation = void 0;
const joi_1 = __importDefault(require("joi"));
exports.addBusinessValidation = joi_1.default.object({
    name: joi_1.default.string().trim().required().messages({
        "string.base": "Name must be a string.",
        "string.empty": "Name is required.",
        "any.required": "Name is required.",
    }),
    category: joi_1.default.string().trim().required().messages({
        "string.base": "Category must be a string.",
        "string.empty": "Category is required.",
        "any.required": "Category is required.",
    }),
    description: joi_1.default.string().trim().required().messages({
        "string.base": "Description must be a string.",
        "string.empty": "Description is required.",
        "any.required": "Description is required.",
    }),
    address: joi_1.default.string().trim().required().messages({
        "string.base": "Address must be a string.",
        "string.empty": "Address is required.",
        "any.required": "Address is required.",
    }),
    phone: joi_1.default.number().required().messages({
        "number.base": "Phone must be a number.",
        "any.required": "Phone is required.",
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Email must be a valid email address.",
        "string.empty": "Email is required.",
        "any.required": "Email is required.",
    }),
    website: joi_1.default.string().uri().required().messages({
        "string.uri": "Website must be a valid URL.",
        "string.empty": "Website is required.",
        "any.required": "Website is required.",
    }),
    status: joi_1.default.string().valid("Active", "Inactive").required().messages({
        "any.only": "Status must be either 'Active' or 'Inactive'.",
        "any.required": "Status is required.",
    }),
    latitude: joi_1.default.number().required().messages({
        "number.base": "Latitude must be a number.",
        "any.required": "Latitude is required.",
    }),
    longitude: joi_1.default.number().required().messages({
        "number.base": "Longitude must be a number.",
        "any.required": "Longitude is required.",
    }),
    gallery: joi_1.default.array().items(joi_1.default.string().uri()).required().messages({
        "array.base": "Gallery must be an array of URLs.",
        "string.uri": "Each gallery item must be a valid URL.",
        "any.required": "Gallery is required.",
    }),
    hours: joi_1.default.array().items(joi_1.default.object({
        day: joi_1.default.string()
            .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
            .required()
            .messages({
            "any.only": "Day must be a valid day of the week.",
            "any.required": "Day is required.",
        }),
        isClosed: joi_1.default.boolean()
            .required()
            .messages({
            "boolean.base": "isClosed must be a boolean.",
            "any.required": "isClosed is required.",
        }),
        open: joi_1.default.string()
            .empty("")
            .when("isClosed", {
            is: false,
            then: joi_1.default.required().messages({
                "any.required": "Open time is required if the business is not closed that day.",
            }),
            otherwise: joi_1.default.optional(),
        }),
        close: joi_1.default.string()
            .empty("")
            .when("isClosed", {
            is: false,
            then: joi_1.default.required().messages({
                "any.required": "Close time is required if the business is not closed that day.",
            }),
            otherwise: joi_1.default.optional(),
        }),
    })).min(1).required().messages({
        "array.base": "Hours must be an array of objects.",
        "any.required": "Hours are required.",
        "array.min": "At least one hour entry is required.",
    })
});
exports.businessHoursValidation = joi_1.default.object({
    hours: joi_1.default.array().items(joi_1.default.object({
        day: joi_1.default.string()
            .valid("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
            .required()
            .messages({
            "any.only": "Day must be a valid day of the week.",
            "any.required": "Day is required.",
        }),
        isClosed: joi_1.default.boolean()
            .required()
            .messages({
            "boolean.base": "isClosed must be a boolean.",
            "any.required": "isClosed is required.",
        }),
        open: joi_1.default.string()
            .empty("")
            .when("isClosed", {
            is: false,
            then: joi_1.default.required().messages({
                "any.required": "Open time is required if the business is not closed that day.",
            }),
            otherwise: joi_1.default.optional(),
        }),
        close: joi_1.default.string()
            .empty("")
            .when("isClosed", {
            is: false,
            then: joi_1.default.required().messages({
                "any.required": "Close time is required if the business is not closed that day.",
            }),
            otherwise: joi_1.default.optional(),
        }),
    })).min(1).required().messages({
        "array.base": "Hours must be an array of objects.",
        "any.required": "Hours are required.",
        "array.min": "At least one hour entry is required.",
    })
});
