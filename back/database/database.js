const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const logging = process.env.DB_LOGGING === 'true' ? console.log : false;

const buildSequelize = () => {
  if (process.env.DATABASE_URL) {
    return new Sequelize(process.env.DATABASE_URL, {
      dialect: process.env.DATABASE_URL.startsWith('postgres') ? 'postgres' : undefined,
      logging,
      dialectOptions: process.env.DB_SSL === 'true'
        ? { ssl: { require: true, rejectUnauthorized: false } }
        : undefined
    });
  }

  if (process.env.DB_HOST) {
    return new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT || 'postgres',
        logging
      }
    );
  }

  return new Sequelize({
    dialect: 'sqlite',
    storage: process.env.SQLITE_STORAGE || path.join(__dirname, 'finplanner.sqlite'),
    logging
  });
};

const sequelize = buildSequelize();

module.exports = { sequelize };
