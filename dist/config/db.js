"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(env_1.mongoUrl);
        console.log("DB connected!");
    }
    catch (error) {
        console.log("DB connecting error:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
