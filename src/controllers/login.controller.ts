import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../constants/config';
import User from '../models/User';

export const post = async (req: Request, res: Response, next: NextFunction) => {
  const { userEmail } = req.body;

  try {
    const existingUser = await User.findOne({ email: userEmail });

    if (!existingUser) {
      if (!CONFIG.SECRETKEY) {
        throw new Error('Secret key is not defined.');
      }

      const token = jwt.sign({ email: userEmail }, CONFIG.SECRETKEY);

      const newUser = new User({
        email: userEmail,
        token,
      });

      await newUser.save();

      res.cookie('accessToken', token, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 3600000,
      });

      res.json({
        status: 201,
        message: 'Created',
        data: {
          result: 'OK',
        },
      });

      return;
    }

    res.cookie('accessToken', existingUser.token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 3600000,
    });

    res.json({
      status: 200,
      message: 'OK',
      data: {
        result: 'OK',
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
  res.clearCookie('accessToken');

  res.send({
    status: 200,
    message: 'Logged out successfully',
    data: {
      result: 'OK',
    },
  });
};
