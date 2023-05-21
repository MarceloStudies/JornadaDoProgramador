const User = require("../models/user.model");
const JWT = require("../utils/jwt");

exports.auth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  try {
    var token = JWT.verifyJwt(accessToken);

    console.log(res);

    if (token == null) res.send("error");
    else {
      req.accessToken = token;

      next();
    }
  } catch (error) {
    res.status(500);
  }
};
