import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async ()  => {
    try {
        await mongoose.connect(ENV.MONGO_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("Error Connecting to MongoDB :", error)
        process.exit(1);
    }
}
