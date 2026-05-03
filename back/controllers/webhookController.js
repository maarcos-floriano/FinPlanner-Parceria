const Payment = require('../models/Payment');
const User = require('../models/User');
const { sendActivationEmail } = require('../services/mail');
const crypto = require('crypto');

const inferPlan = (event) => {
  const text = `${event.product?.name || ''} ${event.offer?.name || ''} ${event.plan || ''}`.toLowerCase();
  return text.includes('whatsapp') ? 'whatsapp' : 'essential';
};

module.exports = {
  kirvano: async (req, res) => {
    try {
      const event = req.body;
      const eventName = event.event || event.type || event.status;

      if (!['SALE_APPROVED', 'SUBSCRIPTION_PAID', 'APPROVED'].includes(eventName)) {
        return res.status(200).json({ ignored: true });
      }

      const email = event.customer?.email?.toLowerCase();
      const paymentId = String(event.sale_id || event.id || event.transaction_id);
      const plan = inferPlan(event);
      const code = crypto.randomBytes(6).toString('hex').toUpperCase();

      if (!email || !paymentId) {
        return res.status(400).json({ error: 'Payload Kirvano sem email ou pagamento' });
      }

      const [payment] = await Payment.findOrCreate({
        where: {
          provider: 'kirvano',
          provider_payment_id: paymentId
        },
        defaults: {
          email,
          code,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          status: 'ACTIVE'
        }
      });

      await User.update(
        {
          plan,
          subscription_status: 'active',
          kirvano_customer_id: String(event.customer?.id || '')
        },
        { where: { email } }
      );

      await sendActivationEmail(email, payment.code);
      return res.status(200).json({ received: true, plan });
    } catch (error) {
      console.error('Erro webhook Kirvano:', error);
      return res.status(500).json({ error: 'Erro ao processar webhook Kirvano' });
    }
  }
};
