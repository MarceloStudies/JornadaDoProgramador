const express = require("express");
const view = require("../utils/views");
const router = express.Router();
const path = require("path");

var accessMiddleware = require("../middlewares/access.middleware");

router.get("/", function (req, res) {
  res.send(`Sistema`);
});

router.get("/register", (req, res) => {
  res.sendFile(view.get("register"));
});

router.get("/login", (req, res) => {
  res.sendFile(view.get("login"));
});

//router.use(accessMiddleware.auth);

module.exports = router;
