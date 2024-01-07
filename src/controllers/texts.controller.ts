import { Request, Response, NextFunction } from "express";
import vision from "@google-cloud/vision";

const createError = require("http-errors");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");

let credentials;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
} else {
  console.error(
    "GOOGLE_APPLICATION_CREDENTIALS 환경 변수가 정의되지 않았습니다.",
  );
}

const client = new vision.ImageAnnotatorClient({
  credentials,
});

import Text from "../models/Text";
import User from "../models/User";

const { isUserIdValid } = require("../../utils");

export const createText = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

export const uploadText = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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

          if (fullTextAnnotation) {
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
          } else {
            res.status(404).json({ message: "Text not found in image" });
          }
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

export const getTexts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const per_page = parseInt(req.query.per_page as string);
  const page = parseInt(req.query.page as string);
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

export const putText = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId, textId } = req.params;
  const { content, backgroundColor } = req.body;

  const updateText = async () => {
    try {
      const text = await Text.findById({ _id: textId });

      if (text !== null) {
        text.content = content;
        text.backgroundColor = backgroundColor;

        await text.save();

        res.json({
          status: 200,
          message: "Text 업데이트 성공",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateText();
};

export const deleteText = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
