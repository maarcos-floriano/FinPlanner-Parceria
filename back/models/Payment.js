const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },

  provider: {
    type: DataTypes.STRING,
    allowNull: false
  },

  provider_payment_id: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },

  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  status: {
    type: DataTypes.ENUM('ACTIVE', 'USED', 'REFUNDED', 'EXPIRED'),
    defaultValue: 'ACTIVE',
    allowNull: false
  },

  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },

  expires_at: {
    type: DataTypes.DATE,
    allowNull: false
  },

  used_at: {
    type: DataTypes.DATE,
    allowNull: true
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }

}, {
  tableName: 'payments',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['provider', 'provider_payment_id']
    }
  ]
});

module.exports = Payment;
