require("dotenv").config();

const path = require("path");
const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const logger = require("morgan");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

const mongoose = require("mongoose");

const { CONFIG } = require("./constants/config");

const connectToDatabase = async () => {
  try {
    await mongoose.connect(CONFIG.MONGODB_URI);
    console.log("connected");
  } catch (error) {
    console.log("failed");
  }
};

connectToDatabase();

app.use(
  cors({
    origin: "*",
  }),
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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
  res.render("error");
});

module.exports = app;
