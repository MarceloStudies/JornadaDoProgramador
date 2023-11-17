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
  var nickname = "marcelo";

  const { newData } = req.body;

  try {
    await User.updateOne({ nickname: nickname }, { $set: newData });

    res
      .status(200)
      .json({ message: "Dados do usuário atualizados com sucesso" });
  } catch (error) {
    res.status(500).json({
      message:
        "Erro interno do servidor. Por favor, tente novamente mais tarde.",
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
      res.status(404).json({ error: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
};

exports.saveAnswer = async (req, res) => {
  try {
    const userName =  req.session.accessToken.nickname;
    // const userName = '64dab1a975f5ee4a6ecea557';

    const { id, correct, responseTime, topic } = req.body;

    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const answerIndex = user.answers.findIndex(answer => answer.topic === topic );
    const answerDetail = { id, correct, responseTime };

    if (answerIndex !== -1) {
    user.answers[answerIndex].answer.push(answerDetail);

    }else{
    user.answers.push({ topic: topic, answer: [answerDetail] });
    }

    await user.save();

    res.status(200).json("1");
  } catch (error) {
    console.error('Error saving the answer:', error); // log the error
    res.status(500).json({ message: 'Error saving the answer' });
  }
};
exports.updateFirstAccess = async (req, res) => {
  const { nickname } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { nickname: nickname },
      { $set: { firstAccess: false } },
      { new: true },
    );

    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};


