const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  plan: {
    type: DataTypes.ENUM('free', 'essential', 'whatsapp', 'premium'),
    defaultValue: 'free'
  },
  subscription_status: {
    type: DataTypes.ENUM('trial', 'active', 'past_due', 'canceled'),
    defaultValue: 'trial'
  },
  phone: {
    type: DataTypes.STRING
  },
  google_id: {
    type: DataTypes.STRING
  },
  avatar_url: {
    type: DataTypes.STRING
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  stripe_customer_id: {
    type: DataTypes.STRING
  },
  kirvano_customer_id: {
    type: DataTypes.STRING
  },
  last_login_at: {
    type: DataTypes.DATE
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'users',
  timestamps: false,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password_hash) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    },

    beforeUpdate: async (user) => {
      if (user.changed("password_hash")) {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      }
    }
  }
});

User.prototype.validPassword = async function(password) {
  if (!this.password_hash) return false;
  return await bcrypt.compare(password, this.password_hash);
};

module.exports = User;
