const path = require("path");

exports.get = (file, extension = ".html") =>
  path.join(__dirname, "../views", file + extension);
