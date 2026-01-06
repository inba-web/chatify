import express from "express";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js";
import path from "path";
import { connectDB } from "../src/lib/db.js";
import { ENV } from "./lib/env.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app,server } from "./lib/socket.js";

dotenv.config();

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

app.use(express.json({limit: "20mb"})); 
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());
// app.use(express.urlencoded({extended:true, limit: "10mb"})); 

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  connectDB();
  console.log("Server Running on Port 3000 ");
});
