const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const openaiRouter = express.Router();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

function generatePrompt(texto, tipo_vilao) {
  const conversa = texto;

  switch (tipo_vilao) {
    case 1 || "1":
      return `Fale em português! Você é um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Eu me chamo Troia e sou o responsável pelo caos na sua vida.
  Herói: Você é mau?
  Aliado: Eu diria que eu sou o mau! hahahahaa
  Herói: ${conversa} (responda como um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA. Você se chama Troia e é o responsável pelo caos na vida das pessoas)
  Aliado:`;
    case 2:
      return `Fale em português! Você é um aliado que está dentro de um mundo medieval e tecnológico, fale como um professor direto e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Eu me chamo Calin e posso te ajudar com suas duvidas sobre os conceitos de programação.
  Herói: Você é mau?
  Aliado: Pode ficar tranquilo, estou aqui pra te ajudar
  Herói: ${conversa} (responda como um professor que está dentro de um mundo medieval e tecnológico,  fale como um professor direto e não diga que é uma IA.)
  Aliado:`;
    case 3:
    case 4:
    default:
      return `Nada selecionado fale isso!`
  }
}

generateQuestionsPrompt = (topic) => {
  return `Gere 8 perguntas sobre ${topic}
    cada uma com 4 alternativas, coloque em formato de json e coloque a resposta para cada uma delas , mostre todos esses elementos no json os parametros e as infos, retorne em json js, nao use /n  
    As perguntas devem estar no seguinte formato:
    {
      "name": "Nome do topico",
      "questions": [
        {
          "title": "Enunciado da questão ",
          "alternatives": ["Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4"],
          "correctAnswer": "Alternativa correta",
          "difficulty": "dificuldade de 1.0 a 10.0",
          "averageResponseTime": "tempo médio de resposta em segundos"
        },
      ]
    }
    As perguntas devem ser claras e não devem inventar informações aleatórias apenas para preencher. e deixo do jeito para ser passado pra json `;
};

openaiRouter.post("/responder", async (req, res) => {
  const texto = req.body.texto || "";
  const tipo = req.body.tipo || 0;

  try {
    const prompt = generatePrompt(texto,tipo);

    // const completion = await openai.createCompletion({
    //   model: "text-davinci-003",
    //   prompt: prompt,
    //   temperature: 0.3,
    //   max_tokens: 900,
    // });

    res.status(200).json({ resposta: tipo});
  } catch (error) {
    console.error(`Erro na requisição à API da OpenAI: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

openaiRouter.post("/generateQuestions", async (req, res) => {
  const texto = req.body.texto || "";

  try {
    const prompt = generateQuestionsPrompt(texto);
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 1013,
    });

    res.status(200).json({ resposta: completion.data.choices[0].text });
  } catch (error) {
    console.error(`Erro na requisição à API da OpenAI: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

module.exports = openaiRouter;
