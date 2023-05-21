const router = require("express").Router();

var userController = require("../controllers/user.controller");
var accessMiddleware = require("../middlewares/access.middleware");

router.get("/", function (req, res) {
  res.send(`API Sistema`);
});

router.route("/register").post(userController.register);

router.route("/login").get(userController.login);

//Erro interno do servidor. Por favor, tente novamente mais tarde.

module.exports = router;
