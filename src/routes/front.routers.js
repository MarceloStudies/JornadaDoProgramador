const express = require("express");
const router = express.Router();
const path = require("path");

var accessMiddleware = require("../middlewares/access.middleware");
const openaiRouter = require("../openia/openai_router");

// Suas rotas de frontend existentes
router.get(["/", "/home"], function (req, res) {
  res.render("home");
});

router.get("/sign", (req, res) => {
  res.render("sign");
});

// ... outras rotas de frontend ...

// Rota para a integração com a OpenAI
router.use("/openai", openaiRouter);

// Rotas de frontend protegidas por autenticação
router.get("/game", accessMiddleware.auth, (req, res) => {
  res.render("game", { user: req.session.user });
});

router.get("/profile", accessMiddleware.auth, (req, res) => {
  res.render("profile", { session: req.session });
});

router.get("/dialog", accessMiddleware.auth, (req, res) => {
  res.render("dialog", { session: req.session });
});

router.get("/terminal", accessMiddleware.auth, (req, res) => {
  res.render("terminal", { session: req.session });
});

module.exports = router;
