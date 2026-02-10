"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIp = void 0;
const os_1 = __importDefault(require("os"));
const getLocalIp = () => {
    const interfaces = os_1.default.networkInterfaces();
    for (const iface of Object.values(interfaces)) {
        if (!iface)
            continue;
        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                if (alias.address.startsWith("192.168.") || alias.address.startsWith("10.")) {
                    return alias.address;
                }
            }
        }
    }
    for (const iface of Object.values(interfaces)) {
        if (!iface)
            continue;
        for (const alias of iface) {
            if (alias.family === "IPv4" && !alias.internal) {
                return alias.address;
            }
        }
    }
    return "127.0.0.1";
};
exports.getLocalIp = getLocalIp;
