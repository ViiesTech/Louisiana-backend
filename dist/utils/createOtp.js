"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOtp = void 0;
const otp_generator_1 = __importDefault(require("otp-generator"));
const createOtp = () => {
    return otp_generator_1.default.generate(4, {
        digits: true,
        lowerCaseAlphabets: false,
        specialChars: false,
        upperCaseAlphabets: false
    });
};
exports.createOtp = createOtp;
