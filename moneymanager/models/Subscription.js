import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Subscription = sequelize.define('tbl_subscriptions', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  billingCycle: {
    type: DataTypes.STRING(50),
    defaultValue: 'monthly'
  },
  dueDate: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Subscription;
