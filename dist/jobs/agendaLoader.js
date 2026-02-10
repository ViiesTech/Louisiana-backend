"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAgendaJobs = void 0;
const agendaInstance_1 = require("../jobs/agendaInstance");
const dailySummaryJob_1 = require("./dailySummaryJob");
const notificationJob_1 = require("./notificationJob");
const loadAgendaJobs = async () => {
    try {
        (0, notificationJob_1.defineNotificationJob)(agendaInstance_1.agenda);
        (0, dailySummaryJob_1.defineDailySummaryJob)(agendaInstance_1.agenda);
        await agendaInstance_1.agenda.start();
        console.log("✅ Agenda started");
        await agendaInstance_1.agenda.every("0 0 22 * * *", "send daily summary", {
            userId: "ad487asd465as87das6d987"
        });
    }
    catch (error) {
        console.error("❌ Failed to start Agenda:", error);
        throw error;
    }
};
exports.loadAgendaJobs = loadAgendaJobs;
