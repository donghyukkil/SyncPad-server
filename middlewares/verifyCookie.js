const jwt = require("jsonwebtoken");

const { CONFIG } = require("../constants/config");

const verifyCookie = (req, res, next) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ error: "토큰이 유효하지 않습니다." });
  }

  try {
    const decodedToken = jwt.verify(accessToken, CONFIG.SECRETKEY);
    req.token = decodedToken;

    next();
  } catch (error) {
    return res.status(403).json({ error: "토큰이 유효하지 않습니다." });
  }
};

module.exports = verifyCookie;
