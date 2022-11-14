import "reflect-metadata";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import connection from "./database";
import { AuthRoute } from "./routes/AuthRoute";
import { User } from "./models/User";
import { ShortcutRoute } from "./routes/ShortcutRoute";

const app = express();
dotenv.config();

app.use(express.json());

app.get("/", (req: Request, res: Response): Response => {
  return res.json({ message: "Sequelize Example 🤟" });
});

// auth routes
app.use("/auth", AuthRoute);
app.use("/shortcut", ShortcutRoute);

const start = async (): Promise<void> => {
  try {
    await connection.sync();
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

void start();
