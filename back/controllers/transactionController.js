const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');

const monthlyLimit = 20;

const buildFilters = (userId, query = {}) => {
  const { type, category, startDate, endDate } = query;
  const where = { user_id: userId };

  if (type && type !== 'all') where.type = type;
  if (category && category !== 'all') where.category = category;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date[Op.gte] = startDate;
    if (endDate) where.date[Op.lte] = endDate;
  }

  return where;
};

const assertFreeLimit = async (user) => {
  if (user.plan !== 'free') return null;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await Transaction.count({
    where: {
      user_id: user.id,
      created_at: { [Op.gte]: startOfMonth }
    }
  });

  if (count >= monthlyLimit) {
    return {
      error: `Limite do teste atingido (${monthlyLimit} lancamentos/mes)`,
      limit: monthlyLimit,
      current: count,
      upgradeRequired: true
    };
  }

  return null;
};

module.exports = {
  getTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        where: buildFilters(req.user.id, req.query),
        order: [['date', 'DESC'], ['created_at', 'DESC']]
      });

      res.json({ transactions });
    } catch (error) {
      console.error('Erro ao buscar transacoes:', error);
      res.status(500).json({ error: 'Erro ao buscar transacoes' });
    }
  },

  createTransaction: async (req, res) => {
    try {
      const limitError = await assertFreeLimit(req.user);
      if (limitError) return res.status(403).json(limitError);

      const { type, amount, category, date, description } = req.body;
      const transaction = await Transaction.create({
        user_id: req.user.id,
        type,
        amount: parseFloat(amount),
        category,
        date: date || new Date().toISOString().split('T')[0],
        description
      });

      res.status(201).json({
        message: 'Transacao criada com sucesso',
        transaction
      });
    } catch (error) {
      console.error('Erro ao criar transacao:', error);
      res.status(500).json({ error: 'Erro ao criar transacao' });
    }
  },

  updateTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, amount, category, date, description } = req.body;

      const transaction = await Transaction.findOne({ where: { id, user_id: req.user.id } });
      if (!transaction) {
        return res.status(404).json({ error: 'Transacao nao encontrada' });
      }

      await transaction.update({
        type,
        amount: parseFloat(amount),
        category,
        date,
        description
      });

      res.json({
        message: 'Transacao atualizada com sucesso',
        transaction
      });
    } catch (error) {
      console.error('Erro ao atualizar transacao:', error);
      res.status(500).json({ error: 'Erro ao atualizar transacao' });
    }
  },

  deleteTransaction: async (req, res) => {
    try {
      const { id } = req.params;
      const transaction = await Transaction.findOne({ where: { id, user_id: req.user.id } });

      if (!transaction) {
        return res.status(404).json({ error: 'Transacao nao encontrada' });
      }

      await transaction.destroy();
      res.json({ message: 'Transacao excluida com sucesso' });
    } catch (error) {
      console.error('Erro ao excluir transacao:', error);
      res.status(500).json({ error: 'Erro ao excluir transacao' });
    }
  },

  getDashboardData: async (req, res) => {
    try {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

      const transactions = await Transaction.findAll({
        where: {
          user_id: req.user.id,
          date: { [Op.between]: [monthStart, monthEnd] }
        }
      });

      const totalIncome = transactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0);

      const totalExpenses = transactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0);

      res.json({
        dashboard: {
          monthly_balance: totalIncome - totalExpenses,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          month_transaction_count: transactions.length,
          transaction_limit: req.user.plan === 'free' ? monthlyLimit : null
        }
      });
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      res.status(500).json({ error: 'Erro ao buscar dados do dashboard' });
    }
  }
};
