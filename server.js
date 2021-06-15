//Imports
import http from "http";

import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

import dotenv from "dotenv";
dotenv.config();

import { initDb } from "./db.js";
import router from "./router.js";

//Initializing Express App
const app = express();

//Create Server using http
const server = http.createServer(app);
server.timeout = 30000;

app.use(bodyParser.json({ type: "*/*", limit: "50mb", parameterLimit: 50000 }));
app.use(morgan("dev"));

app.use(express.static("public"));
app.use(cors({ origin: "*" }));

router(app);

const port = process.env.PORT || 8080;

initDb(function (err) {
  if (err) {
    throw err;
  } else {
    server.listen(port, () => {
      console.log(`Backend running on ${port}`);
    });
  }
});
