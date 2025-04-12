const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Caminho para o arquivo de perguntas e respostas
const qaFilePath = path.join(__dirname, '../data/qa.json');

// Middleware para verificar o token de administrador
const adminMiddleware = (req, res, next) => {
  console.log('Headers recebidos:', req.headers);
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (!authHeader) {
    console.log('Nenhum cabeçalho Authorization fornecido');
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  const tokenParts = authHeader.split(' ');
  console.log('Token Parts:', tokenParts);

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    console.log('Formato do token inválido');
    return res.status(401).json({ message: 'Formato do token inválido' });
  }

  const token = tokenParts[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decodificado:', decoded);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado: apenas administradores' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log('Erro ao verificar token:', error.message);
    return res.status(401).json({ message: 'Token inválido' });
  }
};

// Endpoint para responder perguntas (público)
router.post('/ask', (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ message: 'Pergunta não fornecida' });
  }

  try {
    const qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
    const matchedQA = qaData.find((qa) => qa.question.toLowerCase() === question.toLowerCase());
    if (matchedQA) {
      return res.json({ answer: matchedQA.answer });
    }
    res.json({ answer: `Desculpe, não tenho uma resposta para: "${question}".` });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar a pergunta' });
  }
});

// Endpoint para listar todas as perguntas e respostas (protegido)
router.get('/list', adminMiddleware, (req, res) => {
  try {
    const qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
    res.json(qaData);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar perguntas e respostas' });
  }
});

// Endpoint para cadastrar perguntas e respostas (protegido)
router.post('/register', adminMiddleware, (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) {
    return res.status(400).json({ message: 'Pergunta e resposta são obrigatórias' });
  }

  try {
    const qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
    qaData.push({ id: Date.now().toString(), question, answer }); // Adiciona um ID único
    fs.writeFileSync(qaFilePath, JSON.stringify(qaData, null, 2));
    res.json({ message: 'Pergunta e resposta cadastradas com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar pergunta e resposta' });
  }
});

// Endpoint para editar uma pergunta e resposta (protegido)
router.put('/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;
  const { question, answer } = req.body;

  if (!question || !answer) {
    return res.status(400).json({ message: 'Pergunta e resposta são obrigatórias' });
  }

  try {
    const qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
    const index = qaData.findIndex((qa) => qa.id === id);
    if (index === -1) {
      return res.status(404).json({ message: 'Pergunta não encontrada' });
    }
    qaData[index] = { id, question, answer };
    fs.writeFileSync(qaFilePath, JSON.stringify(qaData, null, 2));
    res.json({ message: 'Pergunta e resposta atualizadas com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pergunta e resposta' });
  }
});

// Endpoint para excluir uma pergunta e resposta (protegido)
router.delete('/:id', adminMiddleware, (req, res) => {
  const { id } = req.params;

  try {
    const qaData = JSON.parse(fs.readFileSync(qaFilePath, 'utf-8'));
    const filteredData = qaData.filter((qa) => qa.id !== id);
    if (filteredData.length === qaData.length) {
      return res.status(404).json({ message: 'Pergunta não encontrada' });
    }
    fs.writeFileSync(qaFilePath, JSON.stringify(filteredData, null, 2));
    res.json({ message: 'Pergunta e resposta excluídas com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir pergunta e resposta' });
  }
});

module.exports = router;