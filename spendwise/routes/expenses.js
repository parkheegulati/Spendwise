import express from 'express';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.js';
import { Expense, Category } from '../models/index.js';

const router = express.Router();

export const formatExpenseDTO = (expense) => {
  const categoryName = expense.tbl_category ? expense.tbl_category.name : 'N/A';
  return {
    id: expense.id,
    name: expense.name,
    icon: expense.icon,
    categoryId: expense.category_id,
    categoryName: categoryName,
    amount: expense.amount != null ? Number(expense.amount) : 0,
    date: expense.date,
    createdAt: expense.createdAt,
    updatedAt: expense.updatedAt
  };
};

// POST /expenses
router.post('/expenses', authMiddleware, async (req, res, next) => {
  try {
    const { name, icon, categoryId, amount, date } = req.body;
    const profileId = req.user.id;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    const expense = await Expense.create({
      name,
      icon,
      category_id: categoryId || null,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      profile_id: profileId
    });

    const reloaded = await Expense.findByPk(expense.id, {
      include: [{ model: Category, attributes: ['name'] }]
    });

    return res.status(201).json(formatExpenseDTO(reloaded));
  } catch (error) {
    next(error);
  }
});

// POST /expenses/bulk - Bulk Import CSV Array
router.post('/expenses/bulk', authMiddleware, async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { name, amount, date, categoryName, icon }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided for import' });
    }

    const profileId = req.user.id;
    const createdExpenses = [];

    for (const item of items) {
      let categoryId = null;
      if (item.categoryName) {
        let cat = await Category.findOne({
          where: { name: item.categoryName, profile_id: profileId }
        });
        if (!cat) {
          cat = await Category.create({
            name: item.categoryName,
            type: 'expense',
            profile_id: profileId
          });
        }
        categoryId = cat.id;
      }

      const exp = await Expense.create({
        name: item.name || 'Bulk Expense',
        icon: item.icon || '',
        category_id: categoryId,
        amount: parseFloat(item.amount || 0),
        date: item.date || new Date().toISOString().split('T')[0],
        profile_id: profileId
      });
      createdExpenses.push(exp);
    }

    return res.status(201).json({ message: `Successfully imported ${createdExpenses.length} expenses`, count: createdExpenses.length });
  } catch (error) {
    next(error);
  }
});

// GET /expenses (Current month expenses)
router.get('/expenses', authMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0];
    const endDate = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0];

    const expenses = await Expense.findAll({
      where: {
        profile_id: req.user.id,
        date: {
          [Op.gte]: startDate,
          [Op.lte]: endDate
        }
      },
      include: [{ model: Category, attributes: ['name'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']]
    });

    return res.json(expenses.map(formatExpenseDTO));
  } catch (error) {
    next(error);
  }
});

// DELETE /expenses/:id
router.delete('/expenses/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByPk(id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (String(expense.profile_id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this expense' });
    }

    await expense.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
