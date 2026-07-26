import express from 'express';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Category } from '../models/index.js';
import { formatIncomeDTO } from './incomes.js';
import { formatExpenseDTO } from './expenses.js';
import { generateIncomeExcel, generateExpenseExcel } from '../services/excelService.js';

const router = express.Router();

// GET /excel/download/income
router.get('/download/income', authMiddleware, async (req, res, next) => {
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
      order: [['date', 'DESC']]
    });

    const dtoList = incomes.map(formatIncomeDTO);
    const buffer = await generateIncomeExcel(dtoList);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=income.xlsx');
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
});

// GET /excel/download/expense
router.get('/download/expense', authMiddleware, async (req, res, next) => {
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
      order: [['date', 'DESC']]
    });

    const dtoList = expenses.map(formatExpenseDTO);
    const buffer = await generateExpenseExcel(dtoList);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=expense.xlsx');
    return res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;
