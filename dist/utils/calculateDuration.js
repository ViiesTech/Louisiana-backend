"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDuration = void 0;
const moment_1 = __importDefault(require("moment"));
const calculateDuration = (startDate, endDate) => {
    const start = (0, moment_1.default)(startDate, "DD-MM-YYYY");
    const end = (0, moment_1.default)(endDate, "DD-MM-YYYY");
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
        return "0 Days";
    }
    const months = end.diff(start, "months");
    const remainingStart = start.clone().add(months, "months");
    const days = end.diff(remainingStart, "days") + 1;
    let result = "";
    if (months > 0) {
        result += months === 1 ? "1 Month" : `${months} Months`;
    }
    if (days > 0) {
        result += result ? ` ${days} Days` : `${days} Days`;
    }
    return result || "0 Days";
};
exports.calculateDuration = calculateDuration;
