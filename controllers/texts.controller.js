const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

const Text = require("../models/Text");
const User = require("../models/User");

const { isIdValid, isUserIdValid } = require("../utils");

exports.createText = async (req, res, next) => {
  const { userId } = req.params;
  const { content } = req.body;

  if (!isUserIdValid(userId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  if (typeof content !== "string") {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const user = await User.findOne({ email: userId });

    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    const saveText = async () => {
      try {
        const text = new Text({
          userId: user._id,
          content,
        });

        await text.save();

        res.json({
          status: 201,
          message: "Text created successfully",
          data: {
            text,
          },
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
    saveText();
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

exports.uploadText = async (req, res, next) => {
  const { userId } = req.params;
  const base64Image = req.body.imageBase64;

  if (!isUserIdValid(userId)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

  try {
    const user = await User.findOne({ email: userId });

    if (!user) {
      next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

      return;
    }

    const saveText = async () => {
      try {
        if (base64Image) {
          const request = {
            image: {
              content: Buffer.from(base64Image, "base64"),
            },
          };

          const [result] = await client.documentTextDetection(request);
          const { fullTextAnnotation } = result;

          const text = new Text({
            userId: user._id,
            content: fullTextAnnotation.text,
          });

          await text.save();
          res.json({
            status: 201,
            message: "Text created successfully",
            data: {
              text,
            },
          });
        }
      } catch (error) {
        next(
          createError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            ReasonPhrases.INTERNAL_SERVER_ERROR,
          ),
        );
      }
    };

    saveText();
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};
