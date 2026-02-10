"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appPassword = exports.appEmail = exports.jwtSecret = exports.mongoUrl = exports.port = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.port = process.env.PORT;
exports.mongoUrl = process.env.MONGO_URI;
exports.jwtSecret = process.env.JWT_SECRET;
exports.appEmail = process.env.APP_EMAIL;
exports.appPassword = process.env.APP_PASSWORD;
