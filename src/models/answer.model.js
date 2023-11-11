const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  title: String,
  alternatives: [String],
  correctAnswer: String,
  difficulty: Number,
  averageResponseTime: Number
 });
 
 const topicSchema = new mongoose.Schema({
  name: String,
  questions: [questionSchema]
 });
 
 const Topic = mongoose.model('Topic', topicSchema);
 
 module.exports = Topic;
 