require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./database/database');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(origin => origin.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Origem nao permitida pelo CORS'));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

app.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ status: 'OK', db: 'connected', timestamp: new Date() });
  } catch {
    res.status(500).json({ status: 'ERROR', db: 'disconnected' });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: process.env.DB_SYNC_ALTER === 'true' });
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
