import Joi from "joi";

export const signupValidation = Joi.object({
  username: Joi.string().max(50).required().messages({
    "any.required": "*Username is required",
    "string.empty": "*Username is required.",
  }),

  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required.",
    "string.email": "*Please provide a valid email address.",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "any.required": "*Password is required",
    "string.empty": "*Password is required.",
    "string.min": "*Password must be at least 6 characters long.",
  }),

  latitude: Joi.number().optional().allow(null),
  longitude: Joi.number().optional().allow(null),
  profile: Joi.string().optional().allow(""),
  personalization: Joi.array().items(Joi.string()).optional(),
});

export const signinValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required.",
    "string.email": "*Please provide a valid email address.",
  }),

  password: Joi.string().min(6).max(100).required().messages({
    "any.required": "*Password is required",
    "string.empty": "*Password is required.",
    "string.min": "*Password must be at least 6 characters long.",
  }),
});

export const forgotPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required",
    "string.email": "*Please enter a valid email address",
  }),
});

export const verifyOtpValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required",
    "string.email": "*Please enter a valid email address",
  }),
  otp: Joi.alternatives().try(Joi.string().trim(), Joi.number()).required().messages({
    "string.empty": "*OTP is required.",
    "any.required": "*OTP is required.",
  }),
});

export const resetPasswordValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required",
    "string.email": "*Please enter a valid email address",
  }),
  password: Joi.string().min(6).max(30).required().messages({
    "any.required": "*Password is required",
    "string.empty": "*Password is required",
    "string.min": "*Password must be at least 6 characters long",
  }),
  confirmPassword: Joi.string().min(6).max(30).required().messages({
    "any.required": "*Confirm Password is required",
    "string.empty": "*Confirm Password is required",
    "string.min": "*Confirm Password must be at least 6 characters long",
  }),
});

export const guestValidation = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "*Email is required",
    "string.empty": "*Email is required",
    "string.email": "*Please enter a valid email address",
  }),
});
