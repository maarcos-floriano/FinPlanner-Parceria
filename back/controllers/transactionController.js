const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

module.exports = {
  getTransactions: async (req, res) => {
    try {
      const { type, category, startDate, endDate } = req.query;
      
      const where = { user_id: req.user.id };
      
      // Aplicar filtros
      if (type) where.type = type;
      if (category && category !== 'all') where.category = category;
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date[Op.gte] = startDate;
        if (endDate) where.date[Op.lte] = endDate;
      }
      
      // Verificar limite do plano free
      if (req.user.plan === 'free') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const transactionCount = await Transaction.count({
          where: {
            user_id: req.user.id,
            created_at: { [Op.gte]: startOfMonth }
          }
        });
        
        if (transactionCount >= 20) {
          return res.status(403).json({
            error: 'Limite de transações do plano Free atingido',
            limit: 20,
            current: transactionCount,
            upgradeRequired: true
          });
        }
      }
      
      const transactions = await Transaction.findAll({
        where,
        order: [['date', 'DESC'], ['created_at', 'DESC']]
      });
      
      res.json({ transactions });
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
      res.status(500).json({ error: 'Erro ao buscar transações' });
    }
  },
  
  createTransaction: async (req, res) => {
    try {
      const { type, amount, category, date, description } = req.body;
      
      // Verificar limite do plano free
      if (req.user.plan === 'free') {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        
        const transactionCount = await Transaction.count({
          where: {
            user_id: req.user.id,
            created_at: { [Op.gte]: startOfMonth }
          }
        });
        
        if (transactionCount >= 20) {
          return res.status(403).json({
            error: 'Limite de transações do plano Free atingido (20/mês)',
            upgradeRequired: true
          });
        }
      }
      
      const transaction = await Transaction.create({
        user_id: req.user.id,
        type,
        amount: parseFloat(amount),
        category,
        date: date || new Date().toISOString().split('T')[0],
        description
      });
      
      res.status(201).json({
        message: 'Transação criada com sucesso',
        transaction
      });
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      res.status(500).json({ error: 'Erro ao criar transação' });
    }
  },
  
  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, amount, category, date, description } = req.body;
      
      const transaction = await Transaction.findOne({
        where: { id, user_id: req.user.id }
      });
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
      
      await transaction.update({
        type,
        amount: parseFloat(amount),
        category,
        date,
        description
      });
      
      res.json({
        message: 'Transação atualizada com sucesso',
        transaction
      });
    } catch (error) {
      console.error('Erro ao atualizar transação:', error);
      res.status(500).json({ error: 'Erro ao atualizar transação' });
    }
  },
  
  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      
      const transaction = await Transaction.findOne({
        where: { id, user_id: req.user.id }
      });
      
      if (!transaction) {
        return res.status(404).json({ error: 'Transação não encontrada' });
      }
      
      await transaction.destroy();
      
      res.json({ message: 'Transação excluída com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir transação:', error);
      res.status(500).json({ error: 'Erro ao excluir transação' });
    }
  },
  
  getDashboardData: async (req, res) => {
    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      // Calcular totais
      const transactions = await Transaction.findAll({
        where: { user_id: req.user.id }
      });
      
      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      // Transações do mês atual (para limite free)
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const monthTransactions = await Transaction.count({
        where: {
          user_id: req.user.id,
          created_at: { [Op.gte]: startOfMonth }
        }
      });
      
      res.json({
        dashboard: {
          monthly_balance: totalIncome - totalExpenses,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          month_transaction_count: monthTransactions,
          transaction_limit: req.user.plan === 'free' ? 20 : null
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
  }
};