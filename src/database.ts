// @/connection.ts
require("dotenv").config();
import { Sequelize } from "sequelize-typescript";
import models from "./models";

const connection = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOSTNAME,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  logging: false,
  models: models,
});

export default connection;
