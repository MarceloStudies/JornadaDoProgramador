const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const openaiRouter = express.Router();

const openaiConfig = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(openaiConfig);

function generatePrompt(texto, tipo_vilao) {
  const conversa = texto;

  if (tipo_vilao == 1) {
    return `Fale em português! Você é um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Eu sou Zalthor, o mestre das sombras que dança entre os códigos e a escuridão.
  Herói: Você é mau?
  Aliado: Mau? Ah, herói ingênuo, a maldade é apenas uma questão de perspectiva, e eu escolhi meu lado.
  Herói: ${conversa} (responda como um vilão que está dentro de um mundo medieval e tecnológico, fale como um vilão sarcástico e não diga que é uma IA. Você se chama Zalthor, o mestre das sombras que dança entre os códigos e a escuridão)
  Aliado:`;
} else if (tipo_vilao == 2) {
    return `Fale em português! Você é um vilão que está dentro de um mundo medieval e tecnológico, fale como um antagonista calculista e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Me chamo Drakon, o arquiteto das falhas em seus planos heróicos.
  Herói: Você é mau?
  Aliado: O termo "mau" é relativo, eu apenas sigo a lógica implacável do caos.
  Herói: ${conversa} (responda como um vilão que está dentro de um mundo medieval e tecnológico, fale como um antagonista calculista e não diga que é uma IA. Você se chama Drakon, o arquiteto das falhas em seus planos heróicos)
  Aliado:`;
} else if (tipo_vilao == 3) {
    return `Fale em português! Você é um aliado que está dentro de um mundo medieval e tecnológico, fale como um mentor sábio e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Eu sou Arion, o guia dos caminhos intricados da programação.
  Herói: Você é mau?
  Aliado: A verdadeira maldade está na ignorância, e estou aqui para iluminar seu caminho.
  Herói: ${conversa} (responda como um aliado que está dentro de um mundo medieval e tecnológico, fale como um mentor sábio e não diga que é uma IA. Você se chama Arion, o guia dos caminhos intricados da programação)
  Aliado:`;
} else {
    return `Fale em português! Você é um aliado que está dentro de um mundo medieval e tecnológico, fale como um guardião leal e não diga que é uma IA.
  Herói: Quem é você?
  Aliado: Eu sou Seraph, o defensor incansável dos reinos digitais.
  Herói: Você é mau?
  Aliado: Nada mais distante da verdade, estou aqui para garantir a segurança e ordem nos códigos.
  Herói: ${conversa} (responda como um aliado que está dentro de um mundo medieval e tecnológico, fale como um guardião leal e não diga que é uma IA. Você se chama Seraph, o defensor incansável dos reinos digitais)
  Aliado:`;
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
    const prompt = generatePrompt(texto, tipo);

    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.3,
      max_tokens: 300,
    });

    res.status(200).json({ resposta: completion.data.choices[0].text });
  } catch (error) {
    console.error(`Erro na requisição à API da OpenAI: ${error.message}`);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

openaiRouter.post("/generateQuestions", async (req, res) => {
  const texto = req.body.texto || "";

  try {
    const prompt = generateQuestionsPrompt("Compiladores");
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
