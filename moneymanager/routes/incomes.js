import express from 'express';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Category } from '../models/index.js';

const router = express.Router();

export const formatIncomeDTO = (income) => {
  const categoryName = income.tbl_category ? income.tbl_category.name : 'N/A';
  return {
    id: income.id,
    name: income.name,
    icon: income.icon,
    categoryId: income.category_id,
    categoryName: categoryName,
    amount: income.amount != null ? Number(income.amount) : 0,
    date: income.date,
    createdAt: income.createdAt,
    updatedAt: income.updatedAt
  };
};

// POST /incomes
router.post('/incomes', authMiddleware, async (req, res, next) => {
  try {
    const { name, icon, categoryId, amount, date } = req.body;
    const profileId = req.user.id;

    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: 'Category not found' });
      }
    }

    const income = await Income.create({
      name,
      icon,
      category_id: categoryId || null,
      amount,
      date: date || new Date().toISOString().split('T')[0],
      profile_id: profileId
    });

    const reloaded = await Income.findByPk(income.id, {
      include: [{ model: Category, attributes: ['name'] }]
    });

    return res.status(201).json(formatIncomeDTO(reloaded));
  } catch (error) {
    next(error);
  }
});

// POST /incomes/bulk - Bulk Import CSV Array
router.post('/incomes/bulk', authMiddleware, async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { name, amount, date, categoryName, icon }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'No items provided for import' });
    }

    const profileId = req.user.id;
    const createdIncomes = [];

    for (const item of items) {
      let categoryId = null;
      if (item.categoryName) {
        let cat = await Category.findOne({
          where: { name: item.categoryName, profile_id: profileId }
        });
        if (!cat) {
          cat = await Category.create({
            name: item.categoryName,
            type: 'income',
            profile_id: profileId
          });
        }
        categoryId = cat.id;
      }

      const inc = await Income.create({
        name: item.name || 'Bulk Income',
        icon: item.icon || '',
        category_id: categoryId,
        amount: parseFloat(item.amount || 0),
        date: item.date || new Date().toISOString().split('T')[0],
        profile_id: profileId
      });
      createdIncomes.push(inc);
    }

    return res.status(201).json({ message: `Successfully imported ${createdIncomes.length} incomes`, count: createdIncomes.length });
  } catch (error) {
    next(error);
  }
});

// GET /incomes (Current month incomes)
router.get('/incomes', authMiddleware, async (req, res, next) => {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0];
    const endDate = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0];

    const incomes = await Income.findAll({
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

    return res.json(incomes.map(formatIncomeDTO));
  } catch (error) {
    next(error);
  }
});

// DELETE /incomes/:id
router.delete('/incomes/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const income = await Income.findByPk(id);

    if (!income) {
      return res.status(404).json({ message: 'Income not found' });
    }

    if (String(income.profile_id) !== String(req.user.id)) {
      return res.status(403).json({ message: 'Unauthorized to delete this income' });
    }

    await income.destroy();
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
