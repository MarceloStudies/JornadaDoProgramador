const express = require("express");
const path = require("path");
const app = express();

// Environment Variables
const dotenv = require("dotenv");

dotenv.config();

const OperationPort = process.env.SISTEM_PORT || 3000;

// DataBase
const mongoose = require("mongoose");
const credentials = require("./src/configs/credentials");

mongoose.set("strictQuery", true);
global.db = mongoose.connect(
  `mongodb+srv://${credentials.USERNAME}:${credentials.PASSWORD}@${credentials.HOST}/${credentials.DB}?retryWrites=true&w=majority`
);

// Use
const cors = require("cors");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "img", "logoB.png")));

// Router
const front = require("./src/routes/front.routers");
const api = require("./src/routes/api.routers");

app.use("/", front);
app.use("/api/", api);

// Status Scenario
app.use((req, res) =>
  res.status(404).sendFile(path.join(__dirname, "public/404Error.html"))
);

// Start System
app.listen(OperationPort, () => {
  console.log(
    "Servidor ligado e disponivel em: http://localhost:" + OperationPort,
    "Para desligar o server, digite: ctrl + C"
  );
});
