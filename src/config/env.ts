import dotenv from "dotenv"
dotenv.config()

export const port = process.env.PORT
export const mongoUrl = process.env.MONGO_URI
export const jwtSecret = process.env.JWT_SECRET