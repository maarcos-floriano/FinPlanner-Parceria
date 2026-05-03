const express = require('express');
const router = express.Router();
const { verifyToken, verifyResetToken, requireAdmin } = require('../middleware/auth');
const { requirePremium } = require('../middleware/premium');

const authController = require('../controllers/authController');
const transactionController = require('../controllers/transactionController');
const goalController = require('../controllers/goalController');
const stripeController = require('../controllers/stripeController');
const webhookController = require('../controllers/webhookController');
const paymentController = require('../controllers/paymentController');
const adminController = require('../controllers/adminController');
const n8nController = require('../controllers/n8nController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/auth/google', authController.googleLogin);
router.get('/me', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);
router.post('/update-pass', verifyResetToken, authController.updatePass);
router.post('/reset-pass', authController.passwordReset);

router.get('/transactions', verifyToken, transactionController.getTransactions);
router.post('/transactions', verifyToken, transactionController.createTransaction);
router.put('/transactions/:id', verifyToken, transactionController.updateTransaction);
router.delete('/transactions/:id', verifyToken, transactionController.deleteTransaction);
router.get('/dashboard', verifyToken, transactionController.getDashboardData);

router.get('/goals', verifyToken, requirePremium, goalController.getGoals);
router.post('/goals', verifyToken, requirePremium, goalController.createGoal);

router.post('/checkout', verifyToken, stripeController.createCheckoutSession);
router.post('/stripe-webhook', express.raw({ type: 'application/json' }), stripeController.handleWebhook);

router.post('/payments/activate', verifyToken, paymentController.activate);

router.get('/admin/overview', verifyToken, requireAdmin, adminController.overview);
router.get('/admin/users', verifyToken, requireAdmin, adminController.users);
router.put('/admin/users/:id', verifyToken, requireAdmin, adminController.updateUser);

router.get('/plan', verifyToken, (req, res) => {
  res.json({ plan: req.user.plan });
});

router.post('/webhooks/kirvano', webhookController.kirvano);
router.post('/webhooks/n8n/transaction', n8nController.createTransaction);
router.post('/webhooks/n8n/summary', n8nController.summary);

module.exports = router;
