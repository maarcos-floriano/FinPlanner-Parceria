const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');
const User = require('./User');

const Goal = sequelize.define('Goal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  target_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  current_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  category: {
    type: DataTypes.STRING
  },
  deadline: {
    type: DataTypes.DATEONLY
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'canceled'),
    defaultValue: 'active'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'goals',
  timestamps: false
});

User.hasMany(Goal, { foreignKey: 'user_id' });
Goal.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Goal;