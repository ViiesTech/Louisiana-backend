import { Request, Response } from "express";
import { toLowerEmail } from "../utils/toLowerEmail";
import { User } from "../models/user";
import { createHashedPassword } from "../utils/createHashedPassword";
import { createJWT } from "../utils/createJWT";
import { sanitizeUser } from "../utils/sanitizeUser";

export const signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, latitude, longitude, profile, personalization } = req.body

        const lowerEmail = toLowerEmail(email);

        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser) {
            res.status(400).json({
                message: "*An account with this email already exists.", success: false,
            });
            return;
        }

        // let profileUrl = "";
        // if (req.file) {
        //   const baseUrl = `${req.protocol}://${req.get("host")}`;
        //   profileUrl = `${baseUrl}/uploads/${req.file.filename}`;
        // }

        const hashedPass = await createHashedPassword(password);

        const newUser = await User.create({
            username, email: lowerEmail, password: hashedPass,
            latitude, longitude, profile, personalization
        });

        const obj = {
            _id: newUser._id.toString(),
            email: newUser.email,
        };

        const token = await createJWT(obj);

        const cleanUser = sanitizeUser(newUser);

        res.status(201).json({
            message: "Signup successfully", success: true, user: cleanUser, token
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "*Internal server error", success: false,
        });
    }
};