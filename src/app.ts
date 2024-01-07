import dotenv from "dotenv";

dotenv.config();

import express, { Request, Response, NextFunction, Express } from "express";
import path from "path";
import createError from "http-errors";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import { CONFIG } from "./constants/config";

const app: Express = express();

app.use(
  cors({
    origin: CONFIG.CLIENT,
    credentials: true,
  }),
);

const connectToDatabase = async (): Promise<void> => {
  try {
    if (CONFIG.MONGODB_URI !== undefined) {
      await mongoose.connect(CONFIG.MONGODB_URI);
    }
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

connectToDatabase();

app.use(logger("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

export default app;
