const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

const Text = require("../models/Text");
const User = require("../models/User");

const { isUserIdValid } = require("../utils");

exports.createText = async (req, res, next) => {
  const { userId } = req.params;
  const { content, backgroundColor } = req.body;

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
        const text = new Text({
          userId: user._id,
          content,
          backgroundColor,
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

exports.getTexts = async (req, res, next) => {
  const { per_page, page } = req.query;
  const { userId } = req.params;

  if (isNaN(per_page) || isNaN(page)) {
    next(createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST));

    return;
  }

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

    const perPageNumber = Number(per_page) || 6;
    const pageNuber = Number(page) || 1;

    const startIndex = (pageNuber - 1) * perPageNumber;
    const endIndex = startIndex + perPageNumber;

    const getTexts = async () => {
      try {
        const texts = await Text.find({ userId: user._id });

        const totalItems = texts.length;
        const totalPages = Math.ceil(totalItems / perPageNumber);

        const sliceTexts = texts.slice(startIndex, endIndex);

        res.json({
          status: 200,
          message: "Success",
          data: sliceTexts,
          totalItems,
          totalPages,
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

    getTexts();
  } catch (error) {
    next(
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      ),
    );
  }
};

exports.putText = async (req, res, next) => {
  const { userId, textId } = req.params;
  const { content, backgroundColor } = req.body;

  const updateText = async () => {
    try {
      const text = await Text.findById({ _id: textId });
      text.content = content;
      text.backgroundColor = backgroundColor;

      await text.save();

      res.json({
        status: 200,
        message: "Text 업데이트 성공",
      });
    } catch (error) {
      console.log(error);
    }
  };

  updateText();
};

exports.deleteText = async (req, res, next) => {
  const { textId } = req.params;

  const deleteText = async () => {
    try {
      const deletedText = await Text.findByIdAndDelete({ _id: textId });

      if (!deleteText) {
        return next(
          createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND),
        );
      }

      res.json({
        status: 204,
        message: "텍스트 삭제 성공",
        data: null,
      });
    } catch (error) {
      createError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        ReasonPhrases.INTERNAL_SERVER_ERROR,
      );
    }
  };

  deleteText();
};
