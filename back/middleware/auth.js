const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }
      
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }
      
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido' });
    }
  },
  
  generateToken: (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  }
};
