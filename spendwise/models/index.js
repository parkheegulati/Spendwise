import sequelize from '../config/database.js';
import Profile from './Profile.js';
import Category from './Category.js';
import Income from './Income.js';
import Expense from './Expense.js';
import Subscription from './Subscription.js';

// Profile <-> Category
Profile.hasMany(Category, { foreignKey: 'profile_id', onDelete: 'CASCADE' });
Category.belongsTo(Profile, { foreignKey: 'profile_id' });

// Profile <-> Income
Profile.hasMany(Income, { foreignKey: 'profile_id', onDelete: 'CASCADE' });
Income.belongsTo(Profile, { foreignKey: 'profile_id' });

// Category <-> Income
Category.hasMany(Income, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Income.belongsTo(Category, { foreignKey: 'category_id' });

// Profile <-> Expense
Profile.hasMany(Expense, { foreignKey: 'profile_id', onDelete: 'CASCADE' });
Expense.belongsTo(Profile, { foreignKey: 'profile_id' });

// Category <-> Expense
Category.hasMany(Expense, { foreignKey: 'category_id', onDelete: 'SET NULL' });
Expense.belongsTo(Category, { foreignKey: 'category_id' });

// Profile <-> Subscription
Profile.hasMany(Subscription, { foreignKey: 'profile_id', onDelete: 'CASCADE' });
Subscription.belongsTo(Profile, { foreignKey: 'profile_id' });

export {
  sequelize,
  Profile,
  Category,
  Income,
  Expense,
  Subscription
};
