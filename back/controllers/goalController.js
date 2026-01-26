const Goal = require('../models/Goal');

module.exports = {
  getGoals: async (req, res) => {
    try {
      const goals = await Goal.findAll({
        where: { user_id: req.user.id },
        order: [['created_at', 'DESC']]
      });
      
      res.json({ goals });
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      res.status(500).json({ error: 'Erro ao buscar metas' });
    }
  },
  
  createGoal: async (req, res) => {
    try {
      const { title, target_amount, category, deadline } = req.body;
      
      const goal = await Goal.create({
        user_id: req.user.id,
        title,
        target_amount: parseFloat(target_amount),
        category,
        deadline,
        status: 'active'
      });
      
      res.status(201).json({
        message: 'Meta criada com sucesso',
        goal
      });
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      res.status(500).json({ error: 'Erro ao criar meta' });
    }
  }
};