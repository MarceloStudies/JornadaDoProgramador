const express = require("express");
const router = express.Router();
const path = require("path");

var accessMiddleware = require("../middlewares/access.middleware");

router.get(["/", "/home"], function (req, res) {
  res.render("home");
});

router.get("/sign", (req, res) => {
  res.render("sign");
});

router.get("/game", accessMiddleware.auth, (req, res) => {
  res.render("game", { user: req.session.user });
});

router.get("/profile", accessMiddleware.auth, (req, res) => {
  res.render("profile", { session: req.session });
});

module.exports = router;
