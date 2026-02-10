"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createJWT = async (payload) => {
    try {
        const token = await jsonwebtoken_1.default.sign(payload, env_1.jwtSecret);
        return token;
    }
    catch (error) {
        return error;
    }
};
exports.createJWT = createJWT;
