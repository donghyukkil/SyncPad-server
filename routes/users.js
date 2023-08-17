const express = require("express");

const router = express.Router();

const loginController = require("../controllers/login.controller");
const textsController = require("../controllers/texts.controller");

router.post("/", loginController.post);

router.post("/:userId/texts", textsController.createTexts);

module.exports = router;
