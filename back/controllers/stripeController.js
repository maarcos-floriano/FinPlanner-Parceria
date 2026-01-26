const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

module.exports = {
  createCheckoutSession: async (req, res) => {
    try {
      // Criar ou obter cliente Stripe
      let stripeCustomerId = req.user.stripe_customer_id;
      
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: req.user.email,
          name: req.user.name,
          metadata: {
            userId: req.user.id
          }
        });
        
        stripeCustomerId = customer.id;
        await req.user.update({ stripe_customer_id: stripeCustomerId });
      }
      
      // Criar sessão de checkout
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'brl',
              product_data: {
                name: 'FinPlanner Premium',
                description: 'Assinatura mensal do FinPlanner Premium'
              },
              unit_amount: 1990, // R$ 19,90
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1
          }
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/premium?canceled=true`,
        metadata: {
          userId: req.user.id
        }
      });
      
      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      console.error('Erro ao criar sessão do Stripe:', error);
      res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  },
  
  handleWebhook: async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    // Processar eventos
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.metadata.userId;
        
        // Atualizar usuário para premium
        await User.update(
          { plan: 'premium' },
          { where: { id: userId } }
        );
        
        console.log(`Usuário ${userId} atualizado para premium`);
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Buscar usuário pelo customer ID
        const user = await User.findOne({
          where: { stripe_customer_id: customerId }
        });
        
        if (user) {
          await user.update({ plan: 'free' });
          console.log(`Usuário ${user.id} downgradado para free`);
        }
        break;
    }
    
    res.json({ received: true });
  }
};