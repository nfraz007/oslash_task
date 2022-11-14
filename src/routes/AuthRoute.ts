import express, { query, Request, Response } from "express";
import { Auth } from "../middlewares/auth";
import { User } from "../models/User";
import { AuthService } from "../services/AuthService";
import { LoginInterface } from "../types/AuthType";
import { ErrorResponse, SuccessResponse } from "../utils/ApiResponse";

const AuthRoute = express.Router();

AuthRoute.post("/register", async (req: Request, res: Response) => {
  try {
    const email: string = req.query.email?.toString() || "";
    const password: string = req.query.password?.toString() || "";
    const name: string = req.query.name?.toString() || "";

    const user: User = await AuthService.register(email, password, name);

    return SuccessResponse(res, "Successfully registered.");
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
});

AuthRoute.post("/login", async (req: Request, res: Response) => {
  try {
    const email: string = req.query.email?.toString() || "";
    const password: string = req.query.password?.toString() || "";

    const { user, userToken }: LoginInterface = await AuthService.login(
      email,
      password
    );

    return SuccessResponse(res, "Successfully Login.", {
      id: user.id,
      name: user.name,
      email: user.email,
      token: userToken.token,
    });
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
});

AuthRoute.post("/logout", Auth, async (req: Request, res: Response) => {
  try {
    await AuthService.logout(req.user);
    return SuccessResponse(res, "Successfully logout.");
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
});

export { AuthRoute };
