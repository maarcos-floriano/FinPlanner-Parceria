const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendActivationEmail(to, code) {
   console.log("📧 Enviando via Resend para:", to);

  try {
    const response = await resend.emails.send({
      from: "Parceria Company <onboarding@resend.dev>",
      to: "thiagovieirab2b@gmail.com",
      subject: "Seu acesso está pronto 🚀",
      html: `
        <h2>Pagamento confirmado!</h2>
        <p>Seu código de ativação:</p>
        <h1>${code}</h1>
        <p>${to}</p>
        <p></p>
      `
    });

    console.log("✅ Email enviado:", response);

  } catch (err) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", err);
  }
}

async function sendAuthPassword(data) {
  console.log("Dados.data:", data.date);

  const { date, email, token} = data;

  try {
    const response = await resend.emails.send({
      from: "Parceria Company <onboarding@resend.dev>",
      to: "thiagovieirab2b@gmail.com",
      subject: "Confimação de atualização de senha",
      html: `
        <h2>Solicitação feita em ${date}</h2>
        <p>Seu código de ativação expira em 30 minutos:</p>
        <p>https://fin-planner-parceria.vercel.app/forgot-password?token=${token}</p>
        <p>${email}</p>
      `
    });

    console.log("✅ Email enviado:", response);

  } catch (err) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", err);
  }
}

async function sendNotificationUpdatePassword(data) {
  console.log("Senha atualizada.");

  const {email } = data;

  try {
    const response = await resend.emails.send({
      from: "Parceria Company <onboarding@resend.dev>",
      to: "thiagovieirab2b@gmail.com",
      subject: "Notificação de atualização de senha",
      html: `
        <h2>Atualização de sua senha foi concluída com sucesso.</h2>
        <p>https://fin-planner-parceria.vercel.app/auth</p>
        <p>${email}</p>
      `
    });

    console.log("✅ Email enviado:", response);

  } catch (err) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", err);
  }

}

module.exports = { sendActivationEmail, sendAuthPassword, sendNotificationUpdatePassword };