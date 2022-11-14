import { NextFunction, Request, Response } from "express";
import { Shortcut } from "../models/Shortcut";
import { NotFoundResponse } from "../utils/ApiResponse";

export const CheckShortcut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const shortcut: Shortcut | null = await Shortcut.findByPk(id, {
      raw: true,
    });

    if (!shortcut) throw new Error();
    if (!shortcut.userId) throw new Error();
    if (shortcut.userId != userId) throw new Error();

    next();
  } catch (err) {
    return NotFoundResponse(res);
  }
};
