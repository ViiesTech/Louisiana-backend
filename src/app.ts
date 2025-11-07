import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors"

const app: Application = express();

app.use(cors())
app.use(bodyParser.json())

export default app;