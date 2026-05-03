const Payment = require('../models/Payment');
const User = require('../models/User');

module.exports = {
  activate: async (req, res) => {
    try {
      const { code, plan = 'essential' } = req.body;
      const userId = req.user.id;

      if (!code) {
        return res.status(400).json({ error: 'Codigo nao informado' });
      }

      const payment = await Payment.findOne({ where: { code, status: 'ACTIVE' } });
      if (!payment) {
        return res.status(400).json({ error: 'Codigo invalido ou ja utilizado' });
      }

      if (payment.expires_at < new Date()) {
        payment.status = 'EXPIRED';
        await payment.save();
        return res.status(400).json({ error: 'Codigo expirado' });
      }

      await Payment.sequelize.transaction(async (transaction) => {
        payment.status = 'USED';
        payment.used_at = new Date();
        payment.user_id = userId;
        await payment.save({ transaction });

        await User.update(
          {
            plan: plan === 'whatsapp' ? 'whatsapp' : 'essential',
            subscription_status: 'active'
          },
          { where: { id: userId }, transaction }
        );
      });

      return res.json({
        success: true,
        message: 'Plano ativado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao ativar codigo:', error);
      return res.status(500).json({ error: 'Erro ao ativar codigo' });
    }
  }
};
