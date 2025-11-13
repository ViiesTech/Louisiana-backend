import Agenda from "agenda";
import { mongoUrl } from "../config/env";

export const agenda = new Agenda({
    db: {
        address: mongoUrl as string,
        collection: "agendaJobs",
    },
});