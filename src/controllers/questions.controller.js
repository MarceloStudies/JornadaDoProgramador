const Question = require("../models/questions.model");
exports.register = async (req, res) => {
  try {
    const question = new Question(req.body);
    await question.save();

    res.status(200).json({ message: "Perguntas registradas com sucesso!" });
  } catch (error) {
    console.log("Error a o registrar a pergunta ", error);
    res.status(500).json({
      message: "Erro interno do servidor",
    });
  }
};
