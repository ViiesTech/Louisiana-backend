"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const sendForgotPasswordEmail = async ({ to, subject, otp, name, templatePath }) => {
    try {
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: env_1.appEmail,
                pass: env_1.appPassword,
            },
        });
        const resolvedTemplatePath = path_1.default.resolve(__dirname, templatePath);
        let html = fs_1.default.readFileSync(resolvedTemplatePath, 'utf-8');
        html = html.replace('{{OTP}}', otp);
        html = html.replace('{{name}}', name);
        const mailOptions = {
            from: `"Louisiana" <${env_1.appEmail}>`,
            to,
            subject,
            html,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent: ${to}`, info.response);
    }
    catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
};
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
