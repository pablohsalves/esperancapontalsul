const express = require('express');
const cors = require('cors');
const path = require('path');
const questionRoutes = require('./routes/questions');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

const app = express();

// Configuração do CORS
app.use(cors({
  origin: 'https://dnsia.redecorp.co',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rotas da API
app.use('/api/questions', questionRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Servir os arquivos estáticos do frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Redirecionar todas as outras rotas para o index.html do frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});