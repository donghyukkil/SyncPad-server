const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const Room = require("../models/Room");
const User = require("../models/User");

exports.createRoom = async (req, res, next) => {
  try {
    const { text_id, userId, roomId, text } = req.body;
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
          roomId,
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
      const room = await Room.findById(roomId);

      if (!room) {
        return res.status(404).json({ error: "방을 찾을 수 없습니다." });
      }

      if (room.userId !== req.token.email) {
        return res.status(403).json({ error: "권한이 없습니다." });
      }

      await Room.findOneAndRemove({ _id: roomId });
      res.status(204).json({ message: "방이 성공적으로 삭제되었습니다." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "서버 오류가 발생했습니다." });
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
