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
    console.log('saveAnswer called'); 

    const userId = '1';
    const { id, correct, responseTime, topic } = req.body;

    console.log('Request body:', req.body); // log the request body

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // const answerIndex = user.answers.findIndex(answer => answer.topic === topic);
    // const answerDetail = { id, correct, responseTime };

    // if (answerIndex !== -1) {
    //   // Topic exists, add to it
    //   user.answers[answerIndex].answer.push(answerDetail);
    // } else {
    //   // Topic does not exist, create it
    //   const answerSchema = { topic, answer: [answerDetail] };
    //   user.answers.push(answerSchema);
    // }

    // await user.save();
    // console.log('User saved successfully');

    res.status(200).json({ message: 'Answer saved successfully' });
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

exports.saveUserAnswer = async (req, res) => {
  try {
    const { userId, topicId, answerDetail } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const topic = user.topics.id(topicId);
    if (topic) {
      topic.answerDetails.push(answerDetail);
    } else {
      user.topics.push({ _id: topicId, answerDetails: [answerDetail] });
    }

    // Save the user
    await user.save();

    res.status(200).json({ message: "User answer saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

