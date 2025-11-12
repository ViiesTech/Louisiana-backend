import Agenda, { Job } from "agenda";
import { mongoUrl } from "../config/env";
import { createNotification } from "../utils/createNotification ";

export const agenda = new Agenda({
    db: {
        address: mongoUrl as string,
        collection: "agendaJobs",
    },
});

export const defineJobs = () => {
    agenda.define("send welcome notification", async (job: Job) => {
        const { userId, username, category, data } = job.attrs.data;
        try {
            await createNotification({
                userId,
                title: "Welcome to our App!",
                description: `Hi ${username}, your account has been created successfully.`,
                category: category || "welcome",
                data,
            });

            console.log(`✅ Welcome notification sent to user: ${username} (${userId})`);
            await job.remove();
        } catch (error) {
            console.error(`❌ Failed to send notification to user: ${username} (${userId})`, error);
        }
    });
};
