const { Op } = require('sequelize');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

const requireN8nSecret = (req, res) => {
  const expected = process.env.N8N_WEBHOOK_SECRET;
  const received = req.headers['x-n8n-secret'] || req.body.secret;

  if (!expected || received !== expected) {
    res.status(401).json({ error: 'Webhook n8n nao autorizado' });
    return false;
  }

  return true;
};

const findUser = async ({ email, phone }) => {
  if (email) {
    return User.findOne({ where: { email: email.toLowerCase() } });
  }

  if (phone) {
    return User.findOne({ where: { phone } });
  }

  return null;
};

module.exports = {
  createTransaction: async (req, res) => {
    try {
      if (!requireN8nSecret(req, res)) return;

      const { email, phone, type, amount, category, date, description } = req.body;
      const user = await findUser({ email, phone });

      if (!user) {
        return res.status(404).json({ error: 'Usuario nao encontrado para este WhatsApp/email' });
      }

      if (user.plan !== 'whatsapp') {
        return res.status(403).json({ error: 'Usuario sem plano WhatsApp ativo' });
      }

      const transaction = await Transaction.create({
        user_id: user.id,
        type,
        amount: parseFloat(amount),
        category: category || 'Outros',
        date: date || new Date().toISOString().split('T')[0],
        description: description || 'Lancamento via WhatsApp'
      });

      res.status(201).json({ transaction });
    } catch (error) {
      console.error('Erro no lancamento n8n:', error);
      res.status(500).json({ error: 'Erro ao registrar transacao via WhatsApp' });
    }
  },

  summary: async (req, res) => {
    try {
      if (!requireN8nSecret(req, res)) return;

      const user = await findUser(req.body);
      if (!user) {
        return res.status(404).json({ error: 'Usuario nao encontrado' });
      }

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const transactions = await Transaction.findAll({
        where: {
          user_id: user.id,
          date: { [Op.gte]: startOfMonth.toISOString().split('T')[0] }
        }
      });

      const income = transactions
        .filter(item => item.type === 'income')
        .reduce((sum, item) => sum + Number(item.amount), 0);
      const expense = transactions
        .filter(item => item.type === 'expense')
        .reduce((sum, item) => sum + Number(item.amount), 0);

      res.json({
        name: user.name,
        plan: user.plan,
        income,
        expense,
        balance: income - expense,
        count: transactions.length
      });
    } catch (error) {
      console.error('Erro no resumo n8n:', error);
      res.status(500).json({ error: 'Erro ao consultar resumo via WhatsApp' });
    }
  }
};
