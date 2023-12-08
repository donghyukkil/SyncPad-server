const express = require("express");

const router = express.Router();

const loginController = require("../controllers/login.controller");
const textsController = require("../controllers/texts.controller");
const roomController = require("../controllers/room.controller");

const verifyToken = require("../middlewares/verifyToken");
const verifyCookie = require("../middlewares/verifyCookie");

router.post("/", verifyToken, loginController.post);

router.post("/logout", loginController.logout);

router.post("/:userId/create", textsController.createText);
router.post("/:userId/upload", textsController.uploadText);
router.get("/:userId/texts", textsController.getTexts);
router.put("/:userId/texts/:textId", textsController.putText);
router.delete("/:userId/texts/:textId", textsController.deleteText);

router.post("/:userId/createRoom", roomController.createRoom);
router.get("/:userId/getRooms", roomController.getroom);
router.delete(
  "/:userId/deleteRooms/:roomId",
  verifyCookie,
  roomController.deleteRoom,
);

module.exports = router;
