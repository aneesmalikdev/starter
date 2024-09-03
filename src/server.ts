import express from "express";
import dotenv from "dotenv";
import * as config from "./configs";
import Logger from "./utils/logger";
dotenv.config();
const app = express();
export function start() {
  console.log({ port: config.port });
  app.listen(config.port, () =>
    Logger.success(`Server listening on port ${process.env.PORT}`)
  );
}
