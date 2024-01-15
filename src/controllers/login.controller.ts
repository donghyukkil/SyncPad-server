import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { CONFIG } from "../constants/config";
import User from "../models/User";

class UserFactory {
  static async createUser(email: string, secretKey: string) {
    const token = jwt.sign({ email: email }, secretKey);

    const newUser = new User({
      email: email,
      token,
    });

    await newUser.save();
    return newUser;
  }
}

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      if (!CONFIG.SECRETKEY) {
        throw new Error("Secret key is not defined.");
      }

      const newUser = await UserFactory.createUser(userEmail, CONFIG.SECRETKEY);

      res.cookie("accessToken", newUser.token, {
        httpOnly: true,
        sameSite: "lax",
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
      sameSite: "lax",
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
    if (error instanceof Error) {
      console.log(error.message);
    }
  }
};

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.clearCookie("accessToken");

  res.send({
    status: 200,
    message: "Logged out successfully",
    data: {
      result: "OK",
    },
  });
};
