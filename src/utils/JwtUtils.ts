require("dotenv").config();
import { JwtPayload, Secret, sign, verify } from "jsonwebtoken";
import { User } from "../models/User";

export const JwtEncode = (user: User): string => {
  return sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET_KEY as string,
    {
      expiresIn: "30 days",
    }
  );
};

export const JwtDecode = (token: string): JwtPayload | string => {
  return verify(token, process.env.JWT_SECRET_KEY as string);
};
