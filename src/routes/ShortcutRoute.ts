import express, { query, Request, Response } from "express";
import { Auth } from "../middlewares/auth";
import { CheckShortcut } from "../middlewares/CheckShortcut";
import { Shortcut } from "../models/Shortcut";
import { ShortcutService } from "../services/ShortcutService";
import { ErrorResponse, SuccessResponse } from "../utils/ApiResponse";

const ShortcutRoute = express.Router();

ShortcutRoute.get("/", Auth, async (req: Request, res: Response) => {
  try {
    const sortBy: string = req.query.sortBy?.toString() || "";
    const sortType: string = req.query.sortType?.toString() || "";
    const search: string = req.query.search?.toString() || "";

    const shortcuts: Shortcut[] = await ShortcutService.getAllByUser(req.user, {
      sortBy,
      sortType,
      search,
    });
    return SuccessResponse(res, "Successfully created.", { shortcuts });
  } catch (e: any) {
    return ErrorResponse(res, e);
  }
});

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

ShortcutRoute.put(
  "/:id",
  [Auth, CheckShortcut],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const shortlink: string = req.query.shortlink?.toString() || "";
      const url: string = req.query.url?.toString() || "";
      const description: string = req.query.description?.toString() || "";
      const tags: string = req.query.tags?.toString() || "";

      await ShortcutService.update(req.user, id, {
        shortlink,
        url,
        description,
        tags,
      });
      return SuccessResponse(res, "Successfully updated.");
    } catch (e: any) {
      return ErrorResponse(res, e);
    }
  }
);

ShortcutRoute.delete(
  "/:id",
  [Auth, CheckShortcut],
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      await ShortcutService.delete(req.user, id);
      return SuccessResponse(res, "Successfully deleted.");
    } catch (e: any) {
      return ErrorResponse(res, e);
    }
  }
);

export { ShortcutRoute };
