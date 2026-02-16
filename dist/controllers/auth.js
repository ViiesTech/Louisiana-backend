"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminSignin = exports.adminSignup = exports.loginAsGuest = exports.resetPassword = exports.verifyOtp = exports.forgotPassword = exports.signin = exports.signup = void 0;
const toLowerEmail_1 = require("../utils/toLowerEmail");
const user_1 = require("../models/user");
const createHashedPassword_1 = require("../utils/createHashedPassword");
const createJWT_1 = require("../utils/createJWT");
const sanitizeUser_1 = require("../utils/sanitizeUser");
const verifyHashedPass_1 = require("../utils/verifyHashedPass");
const createOtp_1 = require("../utils/createOtp");
const sendForgotPasswordEmail_1 = require("../utils/sendForgotPasswordEmail");
const guest_1 = require("../models/guest");
const admin_1 = require("../models/admin");
const agendaInstance_1 = require("../jobs/agendaInstance");
const getTemplatePath_1 = require("../utils/getTemplatePath");
const createUrl_1 = require("../utils/createUrl");
const populateOption_1 = require("../utils/populateOption");
const cleanItineraries_1 = require("../utils/cleanItineraries");
const signup = async (req, res) => {
    try {
        const { username, email, password, latitude, longitude, personalization } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const existingUser = await user_1.User.findOne({ email: lowerEmail });
        if (existingUser) {
            res.status(400).json({
                message: "*An account with this email already exists.", success: false,
            });
            return;
        }
        const profileUrl = (0, createUrl_1.createUrl)(req, req.file, "profile");
        const hashedPass = await (0, createHashedPassword_1.createHashedPassword)(password);
        const newUser = await user_1.User.create({
            username, email: lowerEmail, password: hashedPass,
            profile: profileUrl, personalization,
            location: latitude !== undefined && longitude !== undefined
                ? { type: "Point", coordinates: [longitude, latitude] }
                : undefined,
        });
        agendaInstance_1.agenda.schedule("in 10 seconds", "send welcome notification", {
            userId: newUser._id.toString(),
            username: newUser.username,
            category: 'Info'
        });
        const obj = {
            _id: newUser._id.toString(),
            email: newUser.email,
        };
        const token = await (0, createJWT_1.createJWT)(obj);
        const cleanUser = (0, sanitizeUser_1.sanitizeUser)(newUser);
        res.status(201).json({
            message: "Signup successfully", success: true, user: cleanUser, token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const user = await user_1.User.findOne({ email: lowerEmail }).populate(populateOption_1.getUserPopulate).lean();
        if (!user) {
            res.status(404).json({
                success: false, message: "*No account found with this email address.",
            });
            return;
        }
        const isPasswordValid = await (0, verifyHashedPass_1.verifyHashedPass)(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false, message: "*Invalid password.",
            });
            return;
        }
        const payload = { _id: user._id.toString(), email: user.email };
        const token = await (0, createJWT_1.createJWT)(payload);
        user.itineraries = (0, cleanItineraries_1.cleanItinerariesPlaces)(user.itineraries, ["review", "touristSpot"]);
        const cleanUser = (0, sanitizeUser_1.sanitizeUser)(user);
        return res.status(200).json({
            success: true, message: "Signin successful!", user: cleanUser, token,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};
exports.signin = signin;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const user = await user_1.User.findOne({ email: lowerEmail });
        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false
            });
            return;
        }
        const OTP = await (0, createOtp_1.createOtp)();
        user.otpCode = OTP;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save();
        await (0, sendForgotPasswordEmail_1.sendForgotPasswordEmail)({
            to: lowerEmail,
            subject: "Your OTP Code",
            otp: OTP,
            name: user?.username,
            templatePath: (0, getTemplatePath_1.getTemplatePath)("forgotPassword.html")
        });
        res
            .status(200)
            .json({ message: "Email send successfully.", success: true });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error",
            success: false,
        });
    }
};
exports.forgotPassword = forgotPassword;
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const user = await user_1.User.findOne({ email: lowerEmail });
        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.",
                success: false,
            });
            return;
        }
        if (String(user.otpCode) !== String(otp)) {
            res.status(400).json({ message: "*Invalid OTP code.", success: false });
            return;
        }
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            res.status(400).json({
                message: "*OTP has expired. Please request a new one.",
                success: false,
            });
            return;
        }
        res.status(200).json({ message: "OTP has been successfully verified.", success: true });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false
        });
    }
};
exports.verifyOtp = verifyOtp;
const resetPassword = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false, message: "*Password and Confirm Password do not match."
            });
        }
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const user = await user_1.User.findOne({ email: lowerEmail });
        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false,
            });
            return;
        }
        const hashedPasword = await (0, createHashedPassword_1.createHashedPassword)(password);
        await user_1.User.findByIdAndUpdate({ _id: user?._id }, { password: hashedPasword, otpCode: "", otpExpiresAt: null }, { new: true });
        res.status(200).json({
            message: "*Your password has been changed successfully.", success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.resetPassword = resetPassword;
const loginAsGuest = async (req, res) => {
    try {
        const { email } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        let guest = await guest_1.Guest.findOne({ email: lowerEmail });
        if (!guest) {
            guest = await guest_1.Guest.create({ email: lowerEmail });
        }
        const obj = {
            _id: guest._id.toString(),
            email: guest.email,
        };
        const token = await (0, createJWT_1.createJWT)(obj);
        res.status(200).json({
            message: "Guest email saved successfully", success: true, guest, token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.loginAsGuest = loginAsGuest;
const adminSignup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const hashedPass = await (0, createHashedPassword_1.createHashedPassword)(password);
        const newAdmin = await admin_1.Admin.create({
            name, email: lowerEmail, password: hashedPass
        });
        const obj = {
            _id: newAdmin._id.toString(),
            email: newAdmin.email,
        };
        const token = await (0, createJWT_1.createJWT)(obj);
        res.status(201).json({
            message: "Signup successfully", success: true, admin: newAdmin, token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.adminSignup = adminSignup;
const adminSignin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerEmail = (0, toLowerEmail_1.toLowerEmail)(email);
        const admin = await admin_1.Admin.findOne({ email: lowerEmail });
        if (!admin) {
            res.status(404).json({
                success: false, message: "*No account found with this email address.",
            });
            return;
        }
        const isPasswordValid = await (0, verifyHashedPass_1.verifyHashedPass)(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false, message: "*Invalid password.",
            });
            return;
        }
        const payload = { _id: admin._id.toString(), email: admin.email };
        const token = await (0, createJWT_1.createJWT)(payload);
        res.status(200).json({
            message: "Signin successfully", success: true, admin, token
        });
    }
    catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
exports.adminSignin = adminSignin;
