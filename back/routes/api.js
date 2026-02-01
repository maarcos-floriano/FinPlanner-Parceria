const express = require('express');
const router = express.Router();
const { verifyToken, verifyResetToken } = require('../middleware/auth');
const { requirePremium } = require('../middleware/premium');

// Controladores
const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const goalController = require('../controllers/goalController');
const stripeController = require('../controllers/stripeController');
const webhookController = require('../controllers/webhookController');
const paymentController = require('../controllers/paymentController');

// Autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', verifyToken, authController.getProfile);
router.post('/update-pass', verifyResetToken, authController.updatePass);
router.post('/reset-pass', authController.passwordReset);

// Transações
router.get('/transactions', verifyToken, transactionController.getTransactions);
router.post('/transactions', verifyToken, transactionController.createTransaction);
router.put('/transactions/:id', verifyToken, transactionController.updateTransaction);
router.delete('/transactions/:id', verifyToken, transactionController.deleteTransaction);
router.get('/dashboard', verifyToken, transactionController.getDashboardData);

// Metas (somente premium)
router.get('/goals', verifyToken, requirePremium, goalController.getGoals);
router.post('/goals', verifyToken, requirePremium, goalController.createGoal);

// Stripe (pagamentos)
router.post('/checkout', verifyToken, stripeController.createCheckoutSession);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

// Payment
router.post('/payments/activate', verifyToken, paymentController.activate);

// Informações do plano
router.get('/plan', verifyToken, (req, res) => {
  res.json({ plan: req.user.plan });
});

// Webhooks
router.post('/webhooks/kirvano', webhookController.kirvano);

module.exports = router;