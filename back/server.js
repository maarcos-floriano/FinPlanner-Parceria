require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', require('./routes/api'));

// Health check
app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'OK', db: 'connected', timestamp: new Date() });
  } catch {
    res.status(500).json({ status: 'ERROR', db: 'disconnectd' });
  }
});

// Sincronizar banco e iniciar servidor
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conectado ao banco com sucesso');

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao conectar no banco:', error);
    process.exit(1);
  }
}

startServer();