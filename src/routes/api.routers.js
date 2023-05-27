const router = require("express").Router();

var userController = require("../controllers/user.controller");
var accessMiddleware = require("../middlewares/access.middleware");

router.get("/", function (req, res) {
  res.send(`API Sistema`);
});

router.route("/register").post(userController.register);

router.route("/login").get(userController.login);

router.route("/show").get(accessMiddleware.auth, userController.show);

module.exports = router;
