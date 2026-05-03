const { Op } = require('sequelize');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const publicUserFields = [
  'id',
  'name',
  'email',
  'phone',
  'plan',
  'subscription_status',
  'is_admin',
  'created_at',
  'last_login_at'
];

module.exports = {
  overview: async (req, res) => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalUsers, activeSubscribers, whatsappUsers, newUsersThisMonth, transactionsThisMonth] = await Promise.all([
        User.count(),
        User.count({ where: { plan: { [Op.in]: ['essential', 'whatsapp', 'premium'] } } }),
        User.count({ where: { plan: 'whatsapp' } }),
        User.count({ where: { created_at: { [Op.gte]: startOfMonth } } }),
        Transaction.count({ where: { created_at: { [Op.gte]: startOfMonth } } })
      ]);

      res.json({
        metrics: {
          total_users: totalUsers,
          active_subscribers: activeSubscribers,
          whatsapp_users: whatsappUsers,
          new_users_this_month: newUsersThisMonth,
          transactions_this_month: transactionsThisMonth
        }
      });
    } catch (error) {
      console.error('Erro no overview admin:', error);
      res.status(500).json({ error: 'Erro ao buscar metricas admin' });
    }
  },

  users: async (req, res) => {
    try {
      const { q = '', plan = 'all' } = req.query;
      const where = {};

      if (q) {
        where[Op.or] = [
          { name: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } }
        ];
      }

      if (plan !== 'all') {
        where.plan = plan;
      }

      const users = await User.findAll({
        where,
        attributes: publicUserFields,
        order: [['created_at', 'DESC']],
        limit: 250
      });

      res.json({ users });
    } catch (error) {
      console.error('Erro ao listar usuarios admin:', error);
      res.status(500).json({ error: 'Erro ao listar usuarios' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { plan, subscription_status, phone, is_admin } = req.body;
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ error: 'Usuario nao encontrado' });
      }

      await user.update({
        plan: plan || user.plan,
        subscription_status: subscription_status || user.subscription_status,
        phone: phone !== undefined ? phone : user.phone,
        is_admin: typeof is_admin === 'boolean' ? is_admin : user.is_admin
      });

      res.json({ user });
    } catch (error) {
      console.error('Erro ao atualizar usuario admin:', error);
      res.status(500).json({ error: 'Erro ao atualizar usuario' });
    }
  }
};
