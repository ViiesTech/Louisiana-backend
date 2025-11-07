import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"
import authRouter from "./routes/auth"
import uploadRouter from "./routes/upload"
import adminRouter from "./routes/admin"
import userRouter from "./routes/user"
import { serveUploads } from "./middleware/serveUploads";

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

// app.use("/uploads", express.static("uploads"));
app.use("/uploads", serveUploads);

app.use("/auth", authRouter)
app.use("/upload", uploadRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

export default app;