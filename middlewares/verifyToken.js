const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.json({
      status: 400,
      message: "Bad Request",
      data: {
        error: {
          message: "Bad Request",
          code: 400,
        },
      },
    });
  }

  try {
    const decodedToken = jwt.decode(token, CONFIG.SECRETKEY);

    req.token = decodedToken;

    next();
  } catch (error) {
    return res.json({
      status: 401,
      message: "Unauthorized",
      data: {
        error: {
          message: "unauthorized",
          code: 401,
        },
      },
    });
  }
};

module.exports = verifyToken;
