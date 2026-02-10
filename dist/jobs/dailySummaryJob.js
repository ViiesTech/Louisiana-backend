"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineDailySummaryJob = void 0;
const defineDailySummaryJob = (agenda) => {
    agenda.define("send daily summary", async (job) => {
        const { userId } = job.attrs.data;
        try {
            console.log(`📅 Daily summary sent to user: ${userId}`);
        }
        catch (error) {
            console.error("❌ Error sending daily summary:", error);
        }
    });
};
exports.defineDailySummaryJob = defineDailySummaryJob;
