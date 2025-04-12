const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const adminCredentials = {
  username: 'admin',
  password: bcrypt.hashSync('admin123', 10), // Senha padrão (alterar depois)
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === adminCredentials.username && bcrypt.compareSync(password, adminCredentials.password)) {
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
};