const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

const User = require("../models/User");

exports.post = async (req, res, next) => {
  const { userEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      const token = jwt.sign({ email: userEmail }, CONFIG.SECRETKEY);

      const newUser = new User({
        email: userEmail,
        token,
      });

      await newUser.save();

      res.cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 3600000,
      });

      res.json({
        status: 201,
        message: "Created",
        data: {
          result: "OK",
        },
      });

      return;
    }

    res.cookie("accessToken", existingUser.token, {
      httpOnly: true,
      sameSite: "Lax",
      maxAge: 3600000,
    });

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

exports.logout = async (req, res, next) => {
  res.clearCookie("accessToken");

  res.send({
    status: 200,
    message: "Logged out successfully",
    data: {
      result: "ok",
    },
  });
};
