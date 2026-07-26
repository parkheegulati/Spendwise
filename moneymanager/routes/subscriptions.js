import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { Subscription } from '../models/index.js';

const router = express.Router();

const formatSubscriptionDTO = (sub) => ({
  id: sub.id,
  name: sub.name,
  amount: parseFloat(sub.amount),
  billingCycle: sub.billingCycle,
  dueDate: sub.dueDate,
  category: sub.category,
  icon: sub.icon,
  profileId: sub.profile_id,
  createdAt: sub.createdAt,
  updatedAt: sub.updatedAt
});

// GET /subscriptions
router.get('/subscriptions', authMiddleware, async (req, res, next) => {
  try {
    const subscriptions = await Subscription.findAll({
      where: { profile_id: req.user.id },
      order: [['dueDate', 'ASC']]
    });
    return res.json(subscriptions.map(formatSubscriptionDTO));
  } catch (error) {
    next(error);
  }
});

// POST /subscriptions
router.post('/subscriptions', authMiddleware, async (req, res, next) => {
  try {
    const { name, amount, billingCycle, dueDate, category, icon } = req.body;
    if (!name || !amount) {
      return res.status(400).json({ message: 'Name and amount are required' });
    }

    const sub = await Subscription.create({
      name,
      amount: parseFloat(amount),
      billingCycle: billingCycle || 'monthly',
      dueDate: dueDate ? parseInt(dueDate, 10) : 1,
      category: category || 'General',
      icon: icon || '',
      profile_id: req.user.id
    });

    return res.status(201).json(formatSubscriptionDTO(sub));
  } catch (error) {
    next(error);
  }
});

// DELETE /subscriptions/:id
router.delete('/subscriptions/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const sub = await Subscription.findOne({
      where: { id, profile_id: req.user.id }
    });

    if (!sub) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await sub.destroy();
    return res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    next(error);
  }
});

export default router;
