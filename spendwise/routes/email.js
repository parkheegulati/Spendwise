import express from 'express';
import { Op } from 'sequelize';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Category } from '../models/index.js';
import { formatIncomeDTO } from './incomes.js';
import { formatExpenseDTO } from './expenses.js';
import { generateIncomeExcel, generateExpenseExcel } from '../services/excelService.js';
import { sendEmailWithAttachment } from '../services/emailService.js';

const router = express.Router();

// GET /email/income-excel
router.get('/income-excel', authMiddleware, async (req, res, next) => {
  try {
    const profile = req.user;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0];
    const endDate = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0];

    const incomes = await Income.findAll({
      where: {
        profile_id: profile.id,
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

    await sendEmailWithAttachment(
      profile.email,
      'Your Income Excel Report',
      'Please find attached your income report',
      buffer,
      'income.xlsx'
    );

    return res.status(200).send();
  } catch (error) {
    next(error);
  }
});

// GET /email/expense-excel
router.get('/expense-excel', authMiddleware, async (req, res, next) => {
  try {
    const profile = req.user;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const startDate = new Date(Date.UTC(year, month, 1)).toISOString().split('T')[0];
    const endDate = new Date(Date.UTC(year, month + 1, 0)).toISOString().split('T')[0];

    const expenses = await Expense.findAll({
      where: {
        profile_id: profile.id,
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

    await sendEmailWithAttachment(
      profile.email,
      'Your Expense Excel Report',
      'Please find attached your expense report.',
      buffer,
      'expenses.xlsx'
    );

    return res.status(200).send();
  } catch (error) {
    next(error);
  }
});

export default router;
