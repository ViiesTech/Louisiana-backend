"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const IsAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        res.status(401).json({ success: false, message: '*Not authenticated.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        if (!env_1.jwtSecret) {
            throw new Error('JWT_SECRET not set in .env');
        }
        const decoded = jsonwebtoken_1.default.verify(token, env_1.jwtSecret);
        req._id = decoded._id;
        req.email = decoded.email;
        next();
    }
    catch (error) {
        console.error('JWT error:', error);
        res.status(401).json({ success: false, message: '*Not authenticated.' });
    }
};
exports.IsAuth = IsAuth;
