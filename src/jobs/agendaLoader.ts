import { agenda } from "../jobs/agendaInstance";
import { defineDailySummaryJob } from "./dailySummaryJob";
import { defineNotificationJob } from "./notificationJob";

export const loadAgendaJobs = async () => {
  try {
    defineNotificationJob(agenda);
    defineDailySummaryJob(agenda)
    await agenda.start();
    console.log("✅ Agenda started");
    await agenda.every("0 0 22 * * *", "send daily summary", {
      userId: "ad487asd465as87das6d987"  
    });
  } catch (error) {
    console.error("❌ Failed to start Agenda:", error);
    throw error;
  }
};
