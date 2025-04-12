const Question = require('../models/Question');

exports.getAnswer = async (req, res) => {
  const { question } = req.body;
  try {
    const result = await Question.findOne({ where: { question } });
    if (result) {
      res.json({ answer: result.answer });
    } else {
      res.json({ answer: 'No momento, não sei sobre isso, mas estou aprendendo!' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar resposta' });
  }
};

exports.addQuestion = async (req, res) => {
  const { question, answer } = req.body;
  try {
    const newQuestion = await Question.create({ question, answer });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar pergunta' });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    await Question.destroy({ where: { id } });
    res.json({ message: 'Pergunta excluída com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao excluir pergunta' });
  }
};