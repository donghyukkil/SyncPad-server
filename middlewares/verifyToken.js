const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const admin = require("../config/firebase-config");

const { TEXT } = require("../constants/text");

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    next(createError(StatusCodes.UNAUTHORIZED, ReasonPhrases.UNAUTHORIZED));

    return;
  }

  try {
    const decodeValue = await admin.auth().verifyIdToken(token);

    if (decodeValue) {
      return next();
    }
  } catch (error) {
    if (error instanceof admin.auth.InvaidIdTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: TEXT.STATUS.ERROR,
        message: "Invalid token",
      });
    }

    if (error instanceof admin.auth.ExpiredIdTokenError) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        status: TEXT.STATUS.ERROR,
        message: "Expired token",
      });
    }

    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

module.exports = verifyToken;
