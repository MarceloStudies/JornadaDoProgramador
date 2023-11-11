const Topic = require("../models/answer.model");
const JWT = require("../utils/jwt");

exports.create = async (req, res) => {
    const topic = new Topic(req.body);
    try {
      const savedTopic = await topic.save();
      res.status(201).send(savedTopic);
    } catch (error) {
      res.status(400).send(error);
    }
   };
   
   exports.findAll = async (req, res) => {
    try {
      const topics = await Topic.find();
      res.send(topics);
    } catch (error) {
      res.status(500).send(error);
    }
   };
   
   exports.findOne = async (req, res) => {
    try {
      const topic = await Topic.findById(req.params.id);
      if (!topic) {
        return res.status(404).send();
      }
      res.send(topic);
    } catch (error) {
      res.status(500).send(error);
    }
   };
   
   exports.update = async (req, res) => {
    try {
      const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!topic) {
        return res.status(404).send();
      }
      res.send(topic);
    } catch (error) {
      res.status(400).send(error);
    }
   };
   
   exports.delete = async (req, res) => {
    try {
      const topic = await Topic.findByIdAndDelete(req.params.id);
      if (!topic) {
        return res.status(404).send();
      }
      res.send(topic);
    } catch (error) {
      res.status(500).send(error);
    }
   };
   
exports.findQuestions = async (req, res) => {
    const topicName = req.params.topicName;
    const difficulty = req.params.difficulty;
   
    try {
      const topic = await Topic.findOne({ name: topicName });
      if (!topic) {
        return res.status(404).send();
      }
   
      const questions = topic.questions.filter(question => question.difficulty === difficulty);
      res.send(questions);
    } catch (error) {
      res.status(500).send(error);
    }
   };
   
   exports.updateAverageTime = async (req, res) => {
    const { topicId, questionIndex, newAverageTime } = req.body;
  
    try {
      const topic = await Topic.findOneAndUpdate(
        { _id: topicId },
        { $set: { [`questions.${questionIndex}.averageResponseTime`]: newAverageTime } },
        { new: true }
      );
  
      if (!topic) {
        return res.status(404).send();
      }
  
      res.send(topic);
    } catch (error) {
      res.status(500).send(error);
    }
  };