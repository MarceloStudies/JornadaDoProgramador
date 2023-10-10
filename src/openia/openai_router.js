const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const openaiRouter = express.Router();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, 
});

const openai = new OpenAIApi(openaiConfig);

function generatePrompt(texto) {
  const conversa = texto;
  return `Fale em português! Você é um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA.
  Herói: Quem é você?
  Vilão: Eu me chamo Troia e sou o responsável pelo caos na sua vida.
  Herói: Você é mau?
  Vilão: Eu diria que eu sou o mau! hahahahaa
  Herói: ${conversa} (responda como um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA. Você se chama Troia e é o responsável pelo caos na vida das pessoas)
  Vilão:`;
}

openaiRouter.post("/responder", async (req, res) => {
  const texto = req.body.texto || "";

  try {
    const prompt = generatePrompt(texto);
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
