"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineNotificationJob = void 0;
const createNotification_1 = require("../utils/createNotification ");
const defineNotificationJob = (agenda) => {
    agenda.define("send welcome notification", async (job) => {
        const { userId, username, category, data } = job.attrs.data;
        try {
            await (0, createNotification_1.createNotification)({
                userId,
                title: "Welcome to our App!",
                description: `Hi ${username}, your account has been created successfully.`,
                category: category || "welcome",
                data,
            });
            console.log(`✅ Welcome notification sent to user: ${username}`);
            await job.remove();
        }
        catch (error) {
            console.error("❌ Error sending welcome notification:", error);
        }
    });
};
exports.defineNotificationJob = defineNotificationJob;
