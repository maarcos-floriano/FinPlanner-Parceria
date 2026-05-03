const User = require('../models/User');
const { generateToken } = require('../middleware/auth');
const { sendNotificationUpdatePassword, sendAuthPassword } = require('../services/mail');

const adminEmails = () => (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(email => email.trim().toLowerCase())
  .filter(Boolean);

const sanitizeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  plan: user.plan,
  subscription_status: user.subscription_status,
  phone: user.phone,
  avatar_url: user.avatar_url,
  is_admin: user.is_admin
});

const verifyGoogleCredential = async (credential) => {
  if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID nao configurado');
  }

  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
  if (!response.ok) {
    throw new Error('Token Google invalido');
  }

  const profile = await response.json();
  if (profile.aud !== process.env.GOOGLE_CLIENT_ID || profile.email_verified !== 'true') {
    throw new Error('Conta Google nao verificada');
  }

  return profile;
};

module.exports = {
  register: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      if (!email || !name || !password) {
        return res.status(400).json({ error: 'Nome, email e senha sao obrigatorios' });
      }

      const normalizedEmail = email.toLowerCase();
      const existingUser = await User.findOne({ where: { email: normalizedEmail } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email ja cadastrado' });
      }

      const user = await User.create({
        email: normalizedEmail,
        name,
        password_hash: password,
        is_admin: adminEmails().includes(normalizedEmail)
      });

      res.status(201).json({
        message: 'Usuario criado com sucesso',
        user: sanitizeUser(user),
        token: generateToken(user.id)
      });
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(500).json({ error: 'Erro ao criar usuario' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!user || !(await user.validPassword(password))) {
        return res.status(401).json({ error: 'Credenciais invalidas' });
      }

      await user.update({
        is_admin: user.is_admin || adminEmails().includes(user.email.toLowerCase()),
        last_login_at: new Date()
      });

      res.json({
        message: 'Login realizado com sucesso',
        user: sanitizeUser(user),
        token: generateToken(user.id)
      });
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro ao fazer login' });
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { credential } = req.body;
      if (!credential) {
        return res.status(400).json({ error: 'Credencial Google nao informada' });
      }

      const profile = await verifyGoogleCredential(credential);
      const email = profile.email.toLowerCase();
      const [user] = await User.findOrCreate({
        where: { email },
        defaults: {
          email,
          name: profile.name || email.split('@')[0],
          google_id: profile.sub,
          avatar_url: profile.picture,
          is_admin: adminEmails().includes(email),
          last_login_at: new Date()
        }
      });

      await user.update({
        google_id: user.google_id || profile.sub,
        avatar_url: profile.picture || user.avatar_url,
        is_admin: user.is_admin || adminEmails().includes(email),
        last_login_at: new Date()
      });

      res.json({
        message: 'Login Google realizado com sucesso',
        user: sanitizeUser(user),
        token: generateToken(user.id)
      });
    } catch (error) {
      console.error('Erro no login Google:', error);
      res.status(401).json({ error: 'Nao foi possivel entrar com Google' });
    }
  },

  passwordReset: async (req, res) => {
    try {
      const { email } = req.body;
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
      if (!existingUser) {
        return res.status(400).json({ error: 'Email nao cadastrado' });
      }

      const token = generateToken(existingUser.id, '30m', 'password_reset');
      await sendAuthPassword({
        email,
        date: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
        token
      });

      res.status(200).json({ message: 'Email de alteracao de senha enviado.' });
    } catch (error) {
      console.error('Erro ao enviar email de alteracao de senha:', error);
      res.status(500).json({ error: 'Erro ao enviar email de alteracao de senha.' });
    }
  },

  updatePass: async (req, res) => {
    try {
      const { newPass } = req.body;
      await req.resetUser.update({ password_hash: newPass });
      await sendNotificationUpdatePassword({ email: req.resetUser.email });
      res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      res.status(500).json({ error: 'Erro ao atualizar senha.' });
    }
  },

  getProfile: async (req, res) => {
    try {
      res.json({
        user: {
          ...sanitizeUser(req.user),
          created_at: req.user.created_at
        }
      });
    } catch (error) {
      console.error('Erro ao obter perfil:', error);
      res.status(500).json({ error: 'Erro ao obter perfil' });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { name, phone } = req.body;
      await req.user.update({
        name: name || req.user.name,
        phone: phone || req.user.phone
      });

      res.json({ user: sanitizeUser(req.user) });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
  }
};
