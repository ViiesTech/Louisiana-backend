import { agenda, defineJobs } from "../jobs/agendaJobs";

export const startAgenda = async () => {
  try {
    defineJobs();           // register all jobs
    await agenda.start();   // start the Agenda worker
    console.log("✅ Agenda started");
  } catch (error) {
    console.error("❌ Failed to start Agenda:", error);
    throw error; // re-throw if you want server to stop on failure
  }
};
