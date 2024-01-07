import { Response, NextFunction } from "express";
import { CustomRequest } from "../controllers/room.controller";

import jwt from "jsonwebtoken";
import { CONFIG } from "../constants/config";

const verifyCookie = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { accessToken } = req.cookies;

  if (!accessToken) {
    return res.status(401).json({ message: "로그인을 해주세요" });
  }

  try {
    if (!!CONFIG.SECRETKEY) {
      const decodedToken = jwt.verify(accessToken, CONFIG.SECRETKEY);

      if (typeof decodedToken === "object" && "email" in decodedToken) {
        req.token = decodedToken as { email: string };
      } else {
        throw new Error("Invalid token format");
      }
    }

    next();
  } catch (error) {
    return res.status(403).json({ message: "방 제거 권한이 없습니다." });
  }
};

export default verifyCookie;
