import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { dbConnect } from "./config/DBConnect.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import { cloudinaryConfig } from "./config/Cloudanary.js";
import postRouter from "./routes/postRoutes.js";
import reelRouter from "./routes/reelRouter.js";
import storyRouter from "./routes/storyRouter.js";
import messageRouter from "./routes/messageRoutes.js";
import { app, server } from "./socket.js";

let port = process.env.PORT || 4000;
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));
app.use(express.json())
app.use(cookieParser());
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/reel", reelRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

server.listen(port, () => {
  dbConnect();
  cloudinaryConfig()
  console.log(`server started at ${port}`);
});
