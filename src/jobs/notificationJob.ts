import { Agenda, Job } from "agenda";
import { createNotification } from "../utils/createNotification ";

export const defineNotificationJob = (agenda: Agenda) => {
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

            console.log(`✅ Welcome notification sent to user: ${username}`);
            await job.remove();
        } catch (error) {
            console.error("❌ Error sending welcome notification:", error);
        }
    });
};
