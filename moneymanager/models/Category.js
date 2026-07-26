import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('tbl_categories', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true
  },
  budget: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: true,
    defaultValue: 0
  },
  profile_id: {
    type: DataTypes.BIGINT,
    allowNull: false
  }
}, {
  timestamps: true
});

export default Category;
