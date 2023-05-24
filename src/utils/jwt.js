const jwt = require("jsonwebtoken");

const generateJwt = (data) => {
  const privateKey = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
  const payload = {
    ...data,
    exp: Math.floor(Date.now()) + 10 * 60 * 60 * 1000,
  };

  const token = jwt.sign(payload, privateKey, { algorithm: "RS256" });

  return token;
};

const verifyJwt = (token) => {
  const publicKey = process.env.PUBLIC_KEY.replace(/\\n/g, "\n");

  try {
    const decoded = jwt.verify(token, publicKey, { algorithms: ["RS256"] });

    const currentDate = new Date(Date.now());
    const tokenDate = new Date(decoded.exp);

    if (tokenDate < currentDate) return null;
    else return decoded;
  } catch (error) {
    return null;
  }
};

module.exports = { generateJwt, verifyJwt };
