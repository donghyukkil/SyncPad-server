const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

exports.createTexts = async (req, res, next) => {
  try {
    res.json({
      OK: "OK",
    });
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
