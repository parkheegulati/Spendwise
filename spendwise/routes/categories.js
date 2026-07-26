import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Category, Expense } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

const formatCategoryDTO = (category) => ({
  id: category.id,
  profileId: category.profile_id,
  name: category.name,
  icon: category.icon,
  type: category.type,
  budget: parseFloat(category.budget || 0),
  createdAt: category.createdAt,
  updatedAt: category.updatedAt
});

// POST /categories
router.post('/categories', authMiddleware, async (req, res, next) => {
  try {
    const { name, icon, type, budget } = req.body;
    const profileId = req.user.id;

    const existing = await Category.findOne({
      where: { name, profile_id: profileId }
    });

    if (existing) {
      return res.status(400).json({ message: 'Category with this name already exists' });
    }

    const category = await Category.create({
      name,
      icon,
      type,
      budget: budget ? parseFloat(budget) : 0,
      profile_id: profileId
    });

    return res.status(201).json(formatCategoryDTO(category));
  } catch (error) {
    next(error);
  }
});

// GET /categories
router.get('/categories', authMiddleware, async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { profile_id: req.user.id }
    });

    return res.json(categories.map(formatCategoryDTO));
  } catch (error) {
    next(error);
  }
});

// GET /categories/budgets (with monthly spent calculations)
router.get('/categories-budgets', authMiddleware, async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      where: { profile_id: req.user.id, type: 'expense' }
    });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const result = await Promise.all(categories.map(async (cat) => {
      const expenses = await Expense.findAll({
        where: {
          profile_id: req.user.id,
          category_id: cat.id,
          date: { [Op.between]: [startOfMonth, endOfMonth] }
        }
      });

      const totalSpent = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
      const budget = parseFloat(cat.budget || 0);
      const percentSpent = budget > 0 ? Math.min(Math.round((totalSpent / budget) * 100), 999) : 0;

      return {
        ...formatCategoryDTO(cat),
        totalSpent,
        remaining: Math.max(0, budget - totalSpent),
        percentSpent,
        isOverBudget: budget > 0 && totalSpent > budget
      };
    }));

    return res.json(result);
  } catch (error) {
    next(error);
  }
});

// GET /categories/:type
router.get('/categories/:type', authMiddleware, async (req, res, next) => {
  try {
    const { type } = req.params;
    const categories = await Category.findAll({
      where: {
        profile_id: req.user.id,
        type
      }
    });

    return res.json(categories.map(formatCategoryDTO));
  } catch (error) {
    next(error);
  }
});

// PUT /categories/:categoryId
router.put('/categories/:categoryId', authMiddleware, async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { name, icon, budget } = req.body;

    const category = await Category.findOne({
      where: {
        id: categoryId,
        profile_id: req.user.id
      }
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found or not accessible' });
    }

    if (name !== undefined) category.name = name;
    if (icon !== undefined) category.icon = icon;
    if (budget !== undefined) category.budget = parseFloat(budget || 0);

    await category.save();

    return res.json(formatCategoryDTO(category));
  } catch (error) {
    next(error);
  }
});

export default router;
