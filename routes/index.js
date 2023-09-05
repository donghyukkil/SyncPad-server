const express = require("express");

const router = express.Router();

const Room = require("../models/Room");
const User = require("../models/User");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/createRoom", async (req, res) => {
  try {
    const { text_id, userId } = req.body;

    const user = await User.findOne({ email: userId });

    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    const saveRoom = async () => {
      try {
        const room = new Room({
          userId,
          textId: text_id,
          roomName: text_id,
        });

        await room.save();

        res.json({
          status: 201,
          message: "room created successfully",
          data: {
            room,
          },
        });
      } catch (error) {
        console.log(error);
      }
    };

    saveRoom();
  } catch (error) {
    console.log(error);
  }
});

router.get("/getRooms/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ userId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/users/:userId/deleteRooms/:roomId", async (req, res) => {
  const { userId, roomId } = req.params;

  const deleteRooms = async () => {
    try {
      const deleteRoom = await Room.findOneAndRemove({ roomName: roomId });
      res.json({
        status: 204,
        message: "텍스트 삭제 성공",
        data: null,
      });
    } catch (error) {
      console.log(error);
    }
  };

  deleteRooms();
});

module.exports = router;
