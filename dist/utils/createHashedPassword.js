"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHashedPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const createHashedPassword = async (password) => {
    try {
        const salt = await bcrypt_1.default.genSalt(12);
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        return error;
    }
};
exports.createHashedPassword = createHashedPassword;
