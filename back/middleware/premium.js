module.exports = {
  requirePremium: (req, res, next) => {
    if (!['essential', 'whatsapp', 'premium'].includes(req.user.plan)) {
      return res.status(403).json({ 
        error: 'Recurso exclusivo para assinantes',
        upgradeRequired: true 
      });
    }
    next();
  }
};
