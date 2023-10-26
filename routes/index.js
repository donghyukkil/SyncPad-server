const express = require("express");

const router = express.Router();

const Room = require("../models/Room");
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
