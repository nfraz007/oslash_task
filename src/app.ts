import "reflect-metadata";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { AuthRoute } from "./routes/AuthRoute";
import { ShortcutRoute } from "./routes/ShortcutRoute";

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Api is working" });
});

// auth routes
app.use("/auth", AuthRoute);
app.use("/shortcut", ShortcutRoute);

export default app;
