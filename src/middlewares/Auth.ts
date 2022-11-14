import { verify } from "crypto";
import { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { UnauthenticateResponse } from "../utils/ApiResponse";
import { JwtDecode } from "../utils/JwtUtils";

export const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded: any = JwtDecode(token);
    if (!decoded.id) throw new Error();

    const user: User | null = await User.findByPk(decoded.id);
    if (!user) throw new Error();

    req.user = user?.dataValues;

    next();
  } catch (err) {
    return UnauthenticateResponse(res);
  }
};
