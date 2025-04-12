const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// Credenciais do administrador (hardcoded para simplicidade)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
};

// Rota de login para administradores
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios' });
  }

  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Gera um token JWT
  const token = jwt.sign({ username: ADMIN_CREDENTIALS.username, role: 'admin' }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

module.exports = router;