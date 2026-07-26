import express from 'express';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Category } from '../models/index.js';
import { formatIncomeDTO } from './incomes.js';
import { formatExpenseDTO } from './expenses.js';

const router = express.Router();

// POST /filter
router.post('/filter', authMiddleware, async (req, res, next) => {
  try {
    const { type, startDate, endDate, keyword, sortField, sortOrder } = req.body;
    const profileId = req.user.id;

    if (!type || (type !== 'income' && type !== 'expense')) {
      return res.status(400).send("Invalid type. Must be 'income' or 'expense'");
    }

    const sDate = startDate ? startDate : '1970-01-01';
    const eDate = endDate ? endDate : new Date().toISOString().split('T')[0];
    const kw = keyword ? keyword : '';
    const field = sortField ? sortField : 'date';
    const order = sortOrder && sortOrder.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const whereClause = {
      profile_id: profileId,
      date: {
        [Op.gte]: sDate,
        [Op.lte]: eDate
      },
      name: {
        [Op.like]: `%${kw}%`
      }
    };

    if (type === 'income') {
      const incomes = await Income.findAll({
        where: whereClause,
        include: [{ model: Category, attributes: ['name'] }],
        order: [[field, order]]
      });
      return res.json(incomes.map(formatIncomeDTO));
    } else {
      const expenses = await Expense.findAll({
        where: whereClause,
        include: [{ model: Category, attributes: ['name'] }],
        order: [[field, order]]
      });
      return res.json(expenses.map(formatExpenseDTO));
    }
  } catch (error) {
    next(error);
  }
});

export default router;
