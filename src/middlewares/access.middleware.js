const User = require("../models/user.model");
const JWT = require("../utils/jwt");

exports.auth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;

  try {
    var token = JWT.verifyJwt(accessToken);

    if (token == null) {
      res.status(200).render("error401");
    } else {
      session = {};

      session.user = await User.findOne({ username: token.username })
        .select({
          _id: 0,
          username: 1,
          password: 1,
        })
        .exec();

      session.accessToken = token;

      req.session = session;

      next();
    }
  } catch (error) {
    res.status(500);
  }
};
