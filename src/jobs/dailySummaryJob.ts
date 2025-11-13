import { Agenda, Job } from "agenda";

export const defineDailySummaryJob = (agenda: Agenda) => {
  agenda.define("send daily summary", async (job: Job) => {
    const { userId } = job.attrs.data;
    try {
      console.log(`📅 Daily summary sent to user: ${userId}`);
    } catch (error) {
      console.error("❌ Error sending daily summary:", error);
    }
  });
};
