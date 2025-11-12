import app from "./app";
import { Request, Response } from "express"
import { port } from "./config/env";
import { createServer } from "http";
import { Server } from "socket.io";
import { getLocalIp } from "./utils/getLocalIp";
import { connectDB } from "./config/db";
import { User } from "./models/user";
import { startAgenda } from "./config/agenda";

const httpServer = createServer(app)
const ip = getLocalIp()
connectDB()
startAgenda()

const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
})

app.set("socketio", io);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, Louisiana server!')
})

io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    })
})

httpServer.listen(port, () => {
    console.log(`Server started on ${ip}:${port}`);
})

const addFieldToOldUsers = async () => {
    try {
        const users = await User.find({ 
            notifications: { $exists: false }, 
        });

        for (const user of users) {
            user.notifications = [];
            await user.save();
        }

        console.log(`✅ Updated ${users.length} users with businessReview field.`);
    } catch (err) {
        console.error("❌ Error adding businessReview field:", err);
    }
};

