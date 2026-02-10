"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validate_1 = require("../middleware/validate");
const auth_2 = require("../validations/auth");
const multerConfig_1 = __importDefault(require("../middleware/multerConfig"));
const router = (0, express_1.Router)();
router.post('/signup', multerConfig_1.default.single("profile"), (0, validate_1.validate)(auth_2.signupValidation), auth_1.signup);
router.post('/signin', (0, validate_1.validate)(auth_2.signinValidation), auth_1.signin);
router.post('/forgotPassword', (0, validate_1.validate)(auth_2.forgotPasswordValidation), auth_1.forgotPassword);
router.post('/verifyOtp', (0, validate_1.validate)(auth_2.verifyOtpValidation), auth_1.verifyOtp);
router.post('/resetPassword', (0, validate_1.validate)(auth_2.resetPasswordValidation), auth_1.resetPassword);
router.post('/loginAsGuest', (0, validate_1.validate)(auth_2.guestValidation), auth_1.loginAsGuest);
exports.default = router;
