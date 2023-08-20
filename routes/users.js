const express = require("express");

const router = express.Router();

const loginController = require("../controllers/login.controller");
const textsController = require("../controllers/texts.controller");

router.post("/", loginController.post);

router.post("/:userId/create", textsController.createText);
router.post("/:userId/upload", textsController.uploadText);
router.get("/:userId/texts", textsController.getTexts);

module.exports = router;
