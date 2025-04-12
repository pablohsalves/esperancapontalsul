const express = require('express');
const { getAnswer, addQuestion, deleteQuestion } = require('../controllers/questionController');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const router = express.Router();

router.post('/ask', getAnswer);
router.post('/add', auth, addQuestion);
router.delete('/:id', auth, deleteQuestion);
router.get('/', auth, async (req, res) => {
  try {
    const questions = await Question.findAll();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao listar perguntas' });
  }
});

module.exports = router;