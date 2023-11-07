const router = require("express").Router();

// Importando os controladores e middlewares necessários
var userController = require("../controllers/user.controller");
var accessMiddleware = require("../middlewares/access.middleware");
const openaiRouter = require("../openia/openai_router");

// Rota para o endpoint raiz "/"
router.get("/", function (req, res) {
  res.send(`API Sistema`);
});

// Usando o openaiRouter para todas as rotas que começam com "/openai"
router.route("/openai", openaiRouter);

// Rotas para as operações de usuário

router.route("/login").get(userController.login);
router.route("/show").get(userController.show);
router.route("/showUserLogged").get(accessMiddleware.auth, userController.showUserLogged);

router.route("/register").post(userController.register);
router.route("/update").post(userController.update);

router.route("/user").delete(accessMiddleware.auth, userController.delete);
router.route("/user").put(accessMiddleware.auth, userController.update);

module.exports = router;
