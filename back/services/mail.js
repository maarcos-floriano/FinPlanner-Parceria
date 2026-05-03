const { Resend } = require('resend');

const from = process.env.MAIL_FROM || 'FinPlanner <onboarding@resend.dev>';
const appUrl = process.env.FRONTEND_URL?.split(',')[0] || 'http://localhost:5173';

const getResend = () => {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
};

const sendMail = async ({ to, subject, html }) => {
  const resend = getResend();

  if (!resend) {
    console.log(`[mail:skip] ${subject} -> ${to}`);
    return { skipped: true };
  }

  return resend.emails.send({
    from,
    to,
    subject,
    html
  });
};

async function sendActivationEmail(to, code) {
  try {
    return await sendMail({
      to,
      subject: 'Seu acesso FinPlanner esta pronto',
      html: `
        <h2>Pagamento confirmado!</h2>
        <p>Use o codigo abaixo para ativar seu plano:</p>
        <h1>${code}</h1>
        <p>Email: ${to}</p>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar email de ativacao:', error);
  }
}

async function sendAuthPassword(data) {
  const { date, email, token } = data;

  try {
    return await sendMail({
      to: email,
      subject: 'Redefinicao de senha FinPlanner',
      html: `
        <h2>Solicitacao feita em ${date}</h2>
        <p>Este link expira em 30 minutos:</p>
        <p><a href="${appUrl}/forgot-password?token=${token}">Redefinir senha</a></p>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar email de senha:', error);
  }
}

async function sendNotificationUpdatePassword(data) {
  const { email } = data;

  try {
    return await sendMail({
      to: email,
      subject: 'Senha FinPlanner atualizada',
      html: `
        <h2>Sua senha foi atualizada com sucesso.</h2>
        <p><a href="${appUrl}/auth">Entrar no FinPlanner</a></p>
      `
    });
  } catch (error) {
    console.error('Erro ao enviar notificacao de senha:', error);
  }
}

module.exports = { sendActivationEmail, sendAuthPassword, sendNotificationUpdatePassword };
