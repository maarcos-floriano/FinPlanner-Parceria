const Payment = require('../models/Payment');
const User = require('../models/User');

module.exports = {
  activate: async (req, res) => {
    try {
      const { code } = req.body;
      const userId = req.user.id;

      if (!code) {
        return res.status(400).json({ error: 'Código não informado' });
      }

      const payment = await Payment.findOne({
        where: {
          code,
          status: 'ACTIVE'
        }
      });

      if (!payment) {
        return res.status(400).json({ error: 'Código inválido ou já utilizado' });
      }

      // 🔒 expiração
      if (payment.expires_at < new Date()) {
        payment.status = 'EXPIRED';
        await payment.save();

        return res.status(400).json({ error: 'Código expirado' });
      }

      // 🔥 transação segura
      await Payment.sequelize.transaction(async (t) => {
        // marcar pagamento como usado
        payment.status = 'USED';
        payment.used_at = new Date();
        payment.user_id = userId;

        await payment.save({ transaction: t });

        // ativar PRO no usuário
        await User.update(
          { plan: 'premium' },
          { where: { id: userId }, transaction: t }
        );
      });

      return res.json({
        success: true,
        message: 'Plano PRO ativado com sucesso'
      });

    } catch (error) {
      console.error('Erro ao ativar código:', error);
      return res.status(500).json({ error: 'Erro ao ativar código' });
    }
  }
};
