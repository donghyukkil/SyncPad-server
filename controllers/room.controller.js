const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const Room = require("../models/Room");
const User = require("../models/User");

exports.createRoom = async (req, res, next) => {
  try {
    const { text_id, userId, roomName, text } = req.body;
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
          roomName,
          content: text[0].content,
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
};

exports.deleteRoom = async (req, res, next) => {
  const { roomId } = req.params;

  const deleteRooms = async () => {
    try {
      await Room.findOneAndRemove({ roomName: roomId });

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
};

exports.getroom = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const rooms = await Room.find({ userId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
