const jwt = require("jsonwebtoken");

const generateJwt = (data) => {
  const privateKey = process.env.PRIVATE_KEY;
  const payload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 10,
  };

  // Gerar o token JWT usando a chave privada
  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  return token;
};

const verifyJwt = (token) => {
  const publicKey = process.env.PUBLIC_KEY;

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = { generateJwt, verifyJwt };
