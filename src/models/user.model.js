const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const answerDetailSchema = new mongoose.Schema({
  id: String,
  correct: Boolean,
  responseTime: Number
});
 
const answerSchema = new mongoose.Schema({
  topic: String,
  answer: [answerDetailSchema]
});


var UserSchema = mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      index: {
        unique: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    pontuation: {
      type: Number,
      default: 10.0
    },
    firstAccess: {
      type: Boolean,
      default: true
    },
    answers: [answerSchema],
  },
  { collection: "Users" },
);
UserSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

UserSchema.comparePassword = async (candidatePassword, callback) => {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};


var User = (module.exports = mongoose.model("User", UserSchema));
