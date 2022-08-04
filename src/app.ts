import express from "express";
import http from "http";

import routes from "./routes/index";
import { API_PORT, MONGO_URI, MONGO_USERNAME, MONGO_DB, MONGO_PASSWORD } from "./static/constants";
import { connect } from "mongoose";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.set("view engine", "ejs");
app.use(routes);

// catch 404
app.use(function(req, res, next) {
  res.status(404).json({ "error": "Not Found" });
  next(res);
});

const server = http.createServer(app);

// server listening
server.listen(API_PORT, () => {
  console.log(`Server running on port ${API_PORT}`);
});

// db connect
if (MONGO_URI) {
  connect(MONGO_URI, { auth: { username: MONGO_USERNAME, password: MONGO_PASSWORD }, dbName: MONGO_DB });
}
