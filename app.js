require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const { CONFIG } = require("./constants/config");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(
  cors({
    origin: CONFIG.CLIENT,
    credentials: true,
  }),
);

const connectToDatabase = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_URI);
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
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
