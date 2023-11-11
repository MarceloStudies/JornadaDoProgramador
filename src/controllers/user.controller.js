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
  var nickname = 'marcelo'

  const { newData } = req.body; 

  try {
   
    await User.updateOne({ nickname: nickname }, { $set: newData });

    res.status(200).json({ message: "Dados do usuário atualizados com sucesso" });
  } catch (error) {
    res.status(500).json({
      message: "Erro interno do servidor. Por favor, tente novamente mais tarde.",
    });
  }
};

exports.delete = async (req, res) => {
  var nickname = req.session.accessToken.nickname;


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

exports.showUserLogged = async (req, res) => {
  try {

    const nickname = req.session.accessToken.nickname;


    const foundUser = await User.findOne({ nickname });

    if (foundUser) {
      res.json(foundUser);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

exports.saveAnswer = async (req, res) => {
  const { nickname, answer } = req.body;

  try {
    const user = await User.findOne({ nickname: nickname });

    if (!user) {
      return res.status(404).send();
    }

    user.answers.push(answer);
    const updatedUser = await user.save();

    res.send(updatedUser);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.updateFirstAccess = async (req, res) => {
  const { nickname } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { nickname: nickname },
      { $set: { firstAccess: false } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};