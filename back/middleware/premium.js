module.exports = {
  requirePremium: (req, res, next) => {
    if (req.user.plan !== 'premium') {
      return res.status(403).json({ 
        error: 'Recurso exclusivo para assinantes Premium',
        upgradeRequired: true 
      });
    }
    next();
  }
};