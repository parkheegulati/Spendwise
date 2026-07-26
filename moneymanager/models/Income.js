import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Income = sequelize.define('tbl_incomes', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  category_id: {
    type: DataTypes.BIGINT,
    allowNull: true
  },
  profile_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Income;
