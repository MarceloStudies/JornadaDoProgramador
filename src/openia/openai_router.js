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


generateQuestionsPrompt = (text) => {
  //00 - tema,  01 - range ini, 02 - range de dificuldade, 03 - quantidade, 04 - quantidade de alternativa 

  return `Gere ${text[3]} perguntas sobre ${text[0]} que variam em no nivel de dificuldade entre ${text[1]}  a ${text[2]}
  cada uma com ${text[4]} alternativas, coloque em formato de json e coloque a resposta para cada uma delas , mostre todos esses elementos no json os parametros e as infos, retorne em json js, nao use /n  
  `

  // return `Bom dia`;
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


openaiRouter.post("/generateQuestions", async (req, res) => {
  const texto = req.body.texto || "TEm nada ";


  try {
    const prompt = generateQuestionsPrompt(texto);
    const resp = await openai.createCompletion({
      model: "gpt-3.5-turbo-0613",
      prompt: prompt,
      temperature: 0.2,
      max_tokens: 503,
    });

    res.status(200).json(resp.data);
  } catch (error) {
    console.error(`Erro na requisição à API da OpenAI: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }

});

module.exports = openaiRouter;
