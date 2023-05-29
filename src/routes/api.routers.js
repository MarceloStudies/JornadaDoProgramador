const router = require("express").Router();

var userController = require("../controllers/user.controller");
var accessMiddleware = require("../middlewares/access.middleware");

router.get("/", function (req, res) {
  res.send(`API Sistema`);
});

router.route("/register").post(userController.register);

router.route("/login").get(userController.login);

router.route("/user").put(accessMiddleware.auth, userController.update);

router.route("/user").delete(accessMiddleware.auth, userController.delete);

router.route("/show").get(userController.show);

module.exports = router;
