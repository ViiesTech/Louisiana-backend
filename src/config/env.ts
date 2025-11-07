import dotenv from "dotenv"
dotenv.config()

export const port = process.env.PORT
export const mongoUrl = process.env.MONGO_URI
export const jwtSecret = process.env.JWT_SECRET
export const appEmail = process.env.APP_EMAIL
export const appPassword = process.env.APP_PASSWORD