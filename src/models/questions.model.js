const mongoose = require("mongoose");

var QuestionSchema = mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    theme: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    dificult: {
      type: String,
      required: true,
    },
    timeResponse: {
      type: String,
      required: true,
    },
    alternative: {
      a: {
        type: String,
        required: true,
      },
      b: {
        type: String,
        required: true,
      },
      c: {
        type: String,
        required: true,
      },
      d: {
        type: String,
        required: true,
      },
    },
    reponseCorrect: {
      type: String,
      required: true,
    },
  },
  { collection: "Questions" },
);

QuestionSchema.pre("save", function (next) {
  var question = this;
  next();
});

var Question = (module.exports = mongoose.model("Question", QuestionSchema));
