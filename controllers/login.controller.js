const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

const User = require("../models/User");

exports.post = async (req, res, next) => {
  const { userEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email: userEmail });
    if (!existingUser) {
      const newUser = new User({
        email: userEmail,
      });

      await newUser.save();

      const token = jwt.sign({ email: userEmail }, CONFIG.SECRETKEY, {
        expiresIn: "1h",
      });

      res.json({
        status: 201,
        message: "Created",
        data: {
          result: "OK",
          token,
        },
      });
    }

    res.json({
      status: 200,
      message: "OK",
      data: {
        result: "OK",
      },
    });
  } catch (error) {
    console.log(error.message);
  }
};
