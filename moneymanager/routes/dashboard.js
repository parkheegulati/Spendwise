import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Income, Expense, Category } from '../models/index.js';
import { formatIncomeDTO } from './incomes.js';
import { formatExpenseDTO } from './expenses.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /dashboard
router.get('/dashboard', authMiddleware, async (req, res, next) => {
  try {
    const profileId = req.user.id;

    // Total income sum
    const totalIncomeResult = await Income.sum('amount', {
      where: { profile_id: profileId }
    });
    const totalIncome = totalIncomeResult ? Number(totalIncomeResult) : 0;

    // Total expense sum
    const totalExpenseResult = await Expense.sum('amount', {
      where: { profile_id: profileId }
    });
    const totalExpense = totalExpenseResult ? Number(totalExpenseResult) : 0;

    const totalBalance = totalIncome - totalExpense;

    // Latest 5 incomes
    const latestIncomesList = await Income.findAll({
      where: { profile_id: profileId },
      include: [{ model: Category, attributes: ['name'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 5
    });
    const recent5Incomes = latestIncomesList.map(formatIncomeDTO);

    // Latest 5 expenses
    const latestExpensesList = await Expense.findAll({
      where: { profile_id: profileId },
      include: [{ model: Category, attributes: ['name'] }],
      order: [['date', 'DESC'], ['createdAt', 'DESC']],
      limit: 5
    });
    const recent5Expenses = latestExpensesList.map(formatExpenseDTO);

    // Map to RecentTransactionDTO shape
    const incomeTransactions = recent5Incomes.map(inc => ({
      id: inc.id,
      profileId,
      icon: inc.icon,
      name: inc.name,
      amount: inc.amount,
      date: inc.date,
      createdAt: inc.createdAt,
      updatedAt: inc.updatedAt,
      type: 'income'
    }));

    const expenseTransactions = recent5Expenses.map(exp => ({
      id: exp.id,
      profileId,
      icon: exp.icon,
      name: exp.name,
      amount: exp.amount,
      date: exp.date,
      createdAt: exp.createdAt,
      updatedAt: exp.updatedAt,
      type: 'expense'
    }));

    // Combine and sort by date desc
    const recentTransactions = [...incomeTransactions, ...expenseTransactions].sort((a, b) => {
      const dateCmp = new Date(b.date) - new Date(a.date);
      if (dateCmp !== 0) return dateCmp;
      if (a.createdAt && b.createdAt) {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    // --- AI Smart Insights Computation ---
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0;

    // Find top spending category this month
    const allExpenses = await Expense.findAll({
      where: { profile_id: profileId },
      include: [{ model: Category, attributes: ['name'] }]
    });

    const categorySums = {};
    allExpenses.forEach(exp => {
      const catName = exp.tbl_category ? exp.tbl_category.name : 'General';
      categorySums[catName] = (categorySums[catName] || 0) + Number(exp.amount);
    });

    let topExpenseCategory = 'None';
    let topCategoryAmount = 0;
    Object.entries(categorySums).forEach(([cat, amount]) => {
      if (amount > topCategoryAmount) {
        topCategoryAmount = amount;
        topExpenseCategory = cat;
      }
    });

    const insightsList = [];
    if (savingsRate >= 30) {
      insightsList.push(`🎉 Great job! You are saving ${savingsRate}% of your total income.`);
    } else if (savingsRate > 0) {
      insightsList.push(`💡 Your savings rate is ${savingsRate}%. Try aiming for 20-30% savings.`);
    } else if (totalIncome > 0 && totalExpense > totalIncome) {
      insightsList.push(`⚠️ Caution: Your total expenses exceed your total income by ₹${Math.abs(totalBalance)}.`);
    }

    if (topExpenseCategory !== 'None') {
      const topCatPercent = totalExpense > 0 ? Math.round((topCategoryAmount / totalExpense) * 100) : 0;
      insightsList.push(`📊 Your highest spending category is ${topExpenseCategory} (${topCatPercent}% of total expenses).`);
    } else {
      insightsList.push(`✨ Add your first expense to generate personalized spending insights.`);
    }

    return res.json({
      totalBalance,
      totalIncome,
      totalExpense,
      recent5Expenses,
      recent5Incomes,
      recentTransactions,
      insights: {
        savingsRate,
        topExpenseCategory,
        topCategoryAmount,
        insightsList
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
