const express = require("express");

const router = express.Router();

const loginController = require("../controllers/login.controller");
const textsController = require("../controllers/texts.controller");

router.post("/", loginController.post);
router.post("/logout", loginController.logout);

router.post("/:userId/create", textsController.createText);
router.post("/:userId/upload", textsController.uploadText);
router.get("/:userId/texts", textsController.getTexts);
router.put("/:userId/texts/:textId", textsController.putText);
router.delete("/:userId/texts/:textId", textsController.deleteText);

module.exports = router;
