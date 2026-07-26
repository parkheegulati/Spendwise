import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// GET /profile
router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const profileDTO = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      currency: user.currency || 'INR',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
    return res.json(profileDTO);
  } catch (error) {
    next(error);
  }
});

// PUT /profile - Update profile name, profile image, and currency
router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const user = req.user;
    const { fullName, profileImageUrl, currency } = req.body;

    if (fullName !== undefined) {
      user.fullName = fullName;
    }
    if (profileImageUrl !== undefined) {
      user.profileImageUrl = profileImageUrl;
    }
    if (currency !== undefined) {
      user.currency = currency;
    }

    await user.save();

    const profileDTO = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      currency: user.currency || 'INR',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return res.json(profileDTO);
  } catch (error) {
    next(error);
  }
});

export default router;
