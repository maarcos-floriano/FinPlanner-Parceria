const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

module.exports = {
  register: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      
      // Verificar se usuário já existe
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }
      
      // Criar usuário
      const user = await User.create({
        email,
        name,
        password_hash: password
      });
      
      // Gerar token
      const token = generateToken(user.id);
      
      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        },
        token
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },
  
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Buscar usuário
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Verificar senha
      const validPassword = await user.validPassword(password);
      if (!validPassword) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
      
      // Gerar token
      const token = generateToken(user.id);
      
      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan
        },
        token
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },
  
  getProfile: async (req, res) => {
    try {
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          plan: req.user.plan,
          created_at: req.user.created_at
        }
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ error: 'Erro ao obter perfil' });
    }
  }
};