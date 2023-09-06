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
router.get("/exam", (req, res) => {
  res.render("exam");
});
router.get("/color", (req, res) => {
  res.render("color-palet");
});

router.get("/game", accessMiddleware.auth, (req, res) => {
  res.render("game", { user: req.session.user });
});





router.get("/profile/", accessMiddleware.auth, (req, res) => {
  res.render("profile", { session: req.session });
});

router.get("/edit", accessMiddleware.auth, (req, res) => {
  res.render("profile_old", { session: req.session });
});

router.get("/terminal", accessMiddleware.auth, (req, res) => {
  res.render("terminal", { session: req.session });
});

module.exports = router;
