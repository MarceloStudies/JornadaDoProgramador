const User = require("../models/user.model");
const JWT = require("../utils/jwt");
const bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

exports.register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ nickname: req.body.nickname });

    if (existingUser)
      return res.status(400).json({ message: "Usuário já existe" });

    const newUser = new User(req.body);

    await newUser.save();

    res.status(200).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

exports.login = async (req, res) => {
  var { nickname, password } = req.query;

  try {
    var foundUser = await User.findOne({ nickname: nickname });

    if (!foundUser)
      return res.status(400).json({ message: "Usuario ou senha incorretos." });

    bcrypt.compare(password, foundUser.password, (err, isMatch) => {
      if (err || !isMatch)
        res.status(403).json({
          message: "Usuario ou senha incorretos.",
        });

      var token = JWT.generateJwt({
        nickname: foundUser.nickname,
      });

      res
        .cookie("accessToken", token, {
          maxAge: 100000 * (36 * 24) * 11,
          httpOnly: true,
        })
        .status(200)
        .json({
          message: "Usuario logado com sucesso.",
        });
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return res.status(400).json({ message: "Sessão expirada." });

      bcrypt.hash(req.body.password, salt, async function (err, hash) {
        if (err) return res.status(400).json({ message: "Sessão expirada." });

        var nickname = req.session.user.nickname;

        req.body.password = hash;

        var foundUser = await User.findOneAndUpdate(
          { nickname: nickname },
          req.body
        );

        if (!foundUser)
          return res.status(400).json({ message: "Sessão expirada." });
        else
          return res
            .status(200)
            .json({ message: "Usuário atualizado com sucesso" });
      });
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

exports.delete = async (req, res) => {
  var nickname = req.session.user.nickname;

  try {
    await await User.deleteOne({ nickname: nickname });

    res.clearCookie("accessToken");
    res.status(200).json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

exports.show = async (req, res) => {
  try {
    var foundUser = await User.find();

    res.json(foundUser);
  } catch (error) {
    res.status(500);
  }
};
