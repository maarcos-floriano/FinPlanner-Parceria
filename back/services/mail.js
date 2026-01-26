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
        <p>${}</p>
      `
    });

    console.log("✅ Email enviado:", response);

  } catch (err) {
    console.error("❌ ERRO AO ENVIAR EMAIL:", err);
  }
}

module.exports = { sendActivationEmail };