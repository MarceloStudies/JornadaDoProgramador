const User = require("../models/user.model");
const JWT = require("../utils/jwt");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  var { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const newUser = new User({ username: username, password: password });
    await newUser.save();

    res.status(200).json({ message: "Usuário registrado com sucesso" });
  } catch (error) {
    res.status(500);
  }
};

exports.login = async (req, res) => {
  var { username, password } = req.query;

  try {
    var foundUser = await User.findOne({ username: username });

    bcrypt.compare(password, foundUser.password, (err, isMatch) => {
      if (err || !isMatch)
        res.status(403).json({
          message: "Usuario ou senha incorretos.",
        });

      var token = JWT.generateJwt({
        username: foundUser.username,
      });

      res.cookie("accessToken", token, {
        maxAge: 100000 * (36 * 24) * 11,
        httpOnly: true,
      });

      res.status(200).json({
        message: "Usuario logado com sucesso.",
      });
    });
  } catch (error) {
    res.status(500);
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
