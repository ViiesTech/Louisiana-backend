import { Request, Response } from "express";
import { toLowerEmail } from "../utils/toLowerEmail";
import { User } from "../models/user";
import { createHashedPassword } from "../utils/createHashedPassword";
import { createJWT } from "../utils/createJWT";
import { sanitizeUser } from "../utils/sanitizeUser";
import { verifyHashedPass } from "../utils/verifyHashedPass";
import { createOtp } from "../utils/createOtp";
import { sendForgotPasswordEmail } from "../utils/sendForgotPasswordEmail";
import { Guest } from "../models/guest";
import { Admin } from "../models/admin";
import { agenda } from "../jobs/agendaInstance";
import { getTemplatePath } from "../utils/getTemplatePath";
import { createUrl } from "../utils/createUrl";

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, latitude, longitude, personalization } = req.body

        const lowerEmail = toLowerEmail(email);

        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser) {
            res.status(400).json({
                message: "*An account with this email already exists.", success: false,
            });
            return;
        }

        const profileUrl = createUrl(req, req.file, "profile");

        const hashedPass = await createHashedPassword(password);

        const newUser = await User.create({
            username, email: lowerEmail, password: hashedPass,
            profile: profileUrl, personalization,
            location: latitude !== undefined && longitude !== undefined
                ? { type: "Point", coordinates: [longitude, latitude] }
                : undefined,
        });

        agenda.schedule("in 10 seconds", "send welcome notification", {
            userId: newUser._id.toString(),
            username: newUser.username,
            category: 'Info'
        });

        const obj = {
            _id: newUser._id.toString(),
            email: newUser.email,
        };

        const token = await createJWT(obj);

        const cleanUser = sanitizeUser(newUser, {
            remove: ['favouriteCities', 'visitedCities', 'favouriteBusinesses', 'cityReview', 'businessReview', 'itineraries', 'notifications']
        });

        res.status(201).json({
            message: "Signup successfully", success: true, user: cleanUser, token
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};
export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const lowerEmail = toLowerEmail(email);

        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            res.status(404).json({
                success: false, message: "*No account found with this email address.",
            });
            return
        }

        const isPasswordValid = await verifyHashedPass(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false, message: "*Invalid password.",
            });
            return
        }

        const payload = { _id: user._id.toString(), email: user.email };
        const token = await createJWT(payload);

        const cleanUser = sanitizeUser(user, {
            remove: ['favouriteCities', 'visitedCities', 'favouriteBusinesses', 'cityReview', 'businessReview', 'itineraries', 'notifications']
        });

        return res.status(200).json({
            success: true, message: "Signin successful!", user: cleanUser, token,
        });
    } catch (error) {
        res.status(500).json({
            success: false, message: error instanceof Error ? error.message : "*Internal server error",
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const lowerEmail = toLowerEmail(email);
        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false
            });
            return;
        }
        const OTP = await createOtp();
        user.otpCode = OTP;
        user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min
        await user.save();
        await sendForgotPasswordEmail({
            to: lowerEmail,
            subject: "Your OTP Code",
            otp: OTP,
            name: user?.username,
            templatePath: getTemplatePath("forgotPassword.html")
        });
        res
            .status(200)
            .json({ message: "Email send successfully.", success: true });
    } catch (error) {
        res.status(500).json({
            message:
                error instanceof Error ? error.message : "*Internal server error",
            success: false,
        });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const lowerEmail = toLowerEmail(email);

        const user = await User.findOne({ email: lowerEmail });

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
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false, message: "*Password and Confirm Password do not match."
            });
        }

        const lowerEmail = toLowerEmail(email);

        const user = await User.findOne({ email: lowerEmail });

        if (!user) {
            res.status(400).json({
                message: "*We couldn't find an account with that email address.", success: false,
            });
            return;
        }

        const hashedPasword = await createHashedPassword(password);

        await User.findByIdAndUpdate(
            { _id: user?._id },
            { password: hashedPasword, otpCode: "", otpExpiresAt: null },
            { new: true }
        );
        res.status(200).json({
            message: "*Your password has been changed successfully.", success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};

export const loginAsGuest = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        const lowerEmail = toLowerEmail(email);

        let guest = await Guest.findOne({ email: lowerEmail });

        if (!guest) {
            guest = await Guest.create({ email: lowerEmail });
        }

        const obj = {
            _id: guest._id.toString(),
            email: guest.email,
        };

        const token = await createJWT(obj);

        res.status(200).json({
            message: "Guest email saved successfully", success: true, guest, token
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
}

export const adminSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        const lowerEmail = toLowerEmail(email);

        const hashedPass = await createHashedPassword(password);

        const newAdmin = await Admin.create({
            name, email: lowerEmail, password: hashedPass
        });

        const obj = {
            _id: newAdmin._id.toString(),
            email: newAdmin.email,
        };

        const token = await createJWT(obj);

        res.status(201).json({
            message: "Signup successfully", success: true, admin: newAdmin, token
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};

export const adminSignin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body

        const lowerEmail = toLowerEmail(email);

        const admin = await Admin.findOne({ email: lowerEmail });
        if (!admin) {
            res.status(404).json({
                success: false, message: "*No account found with this email address.",
            });
            return
        }

        const isPasswordValid = await verifyHashedPass(password, admin.password);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false, message: "*Invalid password.",
            });
            return
        }

        const payload = { _id: admin._id.toString(), email: admin.email };
        const token = await createJWT(payload);

        res.status(200).json({
            message: "Signin successfully", success: true, admin, token
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};