"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const getLocalIp_1 = require("./utils/getLocalIp");
const db_1 = require("./config/db");
const agendaLoader_1 = require("./jobs/agendaLoader");
const httpServer = (0, http_1.createServer)(app_1.default);
const ip = (0, getLocalIp_1.getLocalIp)();
(0, db_1.connectDB)();
(0, agendaLoader_1.loadAgendaJobs)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*'
    }
});
app_1.default.set("socketio", io);
app_1.default.get('/', (req, res) => {
    res.send('Hello, Louisiana server!');
});
io.on("connection", (socket) => {
    console.log("🟢 Client connected");
    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    });
});
httpServer.listen(env_1.port, () => {
    console.log(`Server started on Port:${env_1.port}`);
});
