import express, { query, Request, Response } from "express";
import { Auth } from "../middlewares/auth";
import { Shortcut } from "../models/Shortcut";
import { User } from "../models/User";
import { AuthService, LoginInterface } from "../services/AuthService";
import { ShortcutService } from "../services/ShortcutService";
import { ErrorResponse, SuccessResponse } from "../utils/ApiResponse";

const ShortcutRoute = express.Router();

ShortcutRoute.post("/", Auth, async (req: Request, res: Response) => {
  try {
    const shortlink: string = req.query.shortlink?.toString() || "";
    const url: string = req.query.url?.toString() || "";
    const description: string = req.query.description?.toString() || "";
    const tags: string = req.query.tags?.toString() || "";

    const shortcut: Shortcut = await ShortcutService.create(
      req.user,
      shortlink,
      url,
      description,
      tags
    );
    return SuccessResponse(res, "Successfully created.", shortcut);
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
});

export { ShortcutRoute };
