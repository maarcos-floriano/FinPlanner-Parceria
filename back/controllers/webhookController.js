const Payment = require('../models/Payment');
const { sendActivationEmail } = require("../services/mail");
const crypto = require("crypto");

module.exports = {
  kirvano: async (req, res) => {
    const event = req.body;

    if (event.event != "SALE_APPROVED") {
        return res.status(200).json({ ignored: true });
    }

    const email = event.customer.email;
    const paymentId = String(event.sale_id);

    const code = crypto.randomBytes(6).toString("hex").toUpperCase();

    const [payment, created] = await Payment.findOrCreate({
        where: {
            provider: "kirvano",
            provider_payment_id: paymentId
        },
        defaults: {
            email,
            code,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
            status: "ACTIVE"
        }
    });

    // if (created) {
        await sendActivationEmail(email, payment.code);
    // }

    return res.status(200).json({ received: true });
  },
};



