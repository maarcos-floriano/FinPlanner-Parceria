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

  verifyResetToken: async (req, res, next) => {
    const { token } = req.body

    if (!token) {
      return res.status(400).json({ error: "Token não informado" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // garante que é token de reset
      if (decoded.type !== "password_reset") {
        return res.status(401).json({ error: "Token inválido" });
      }

      const user = await User.findByPk(decoded.userId);
      if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      req.resetUser = user; // ⚠️ NÃO use req.user
      next();

    } catch (err) {
      return res.status(401).json({
        error: "Link expirado ou inválido"
      });
    }
  },

  generateToken: (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  },

  generateToken: (userId, expiresIn) => {
    return jwt.sign(
      {
        userId,
        type: "password_reset"
      }, 
      process.env.JWT_SECRET,
      { expiresIn: expiresIn }
    );
  }
};
