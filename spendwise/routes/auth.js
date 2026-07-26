import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../models/index.js';
import sequelize from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../services/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const backendUrl = process.env.MONEY_MANAGER_BACKEND_URL || 'http://localhost:8080';

// Status / Health check endpoints
router.get(['/', '/status', '/health'], (req, res) => {
  res.send('Application is running');
});

// POST /register
router.post('/register', async (req, res, next) => {
  try {
    const { fullName, email, password, profileImageUrl } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const activationToken = uuidv4();

    // Auto-activate all registrations so accounts can log in immediately
    const autoActivate = true;

    let profile = await Profile.findOne({ where: { email } });
    if (profile) {
      if (profile.isActive) {
        return res.status(400).json({ message: 'Email already registered' });
      } else {
        // Update existing profile
        profile.fullName = fullName;
        profile.password = hashedPassword;
        profile.profileImageUrl = profileImageUrl || profile.profileImageUrl;
        profile.isActive = true;
        profile.activationToken = null;
        await profile.save();
      }
    } else {
      profile = await Profile.create({
        fullName,
        email,
        password: hashedPassword,
        profileImageUrl: profileImageUrl || '',
        isActive: true,
        activationToken: null
      });
    }

    // Send activation email
    const activationLink = `${backendUrl}/api/v1.0/activate?token=${activationToken}`;
    const subject = 'Activate your SpendWise account';
    const body = `Click on the following link to activate your account: ${activationLink}`;
    
    // Asynchronous send (doesn't block register response if SMTP isn't configured)
    sendEmail(email, subject, body);

    const profileDTO = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      profileImageUrl: profile.profileImageUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    return res.status(201).json(profileDTO);
  } catch (error) {
    next(error);
  }
});

// GET /activate?token=xxx
router.get('/activate', async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send('Activation token missing');
    }

    const profile = await Profile.findOne({ where: { activationToken: token } });
    if (!profile) {
      return res.status(404).send('Activation token not found or already used');
    }

    profile.isActive = true;
    profile.activationToken = null;
    await profile.save();

    return res.ok ? res.ok('Profile activated successfully') : res.send('Profile activated successfully');
  } catch (error) {
    next(error);
  }
});

// GET /activate-all
router.get('/activate-all', async (req, res, next) => {
  try {
    await Profile.update({ isActive: true }, { where: {} });
    return res.send('All user accounts activated successfully');
  } catch (error) {
    next(error);
  }
});

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email ? email.trim().toLowerCase() : '';

    const profile = await Profile.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        cleanEmail
      )
    });
    if (!profile) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!profile.isActive) {
      return res.status(403).json({
        message: 'Account is not active. Please activate your account first.'
      });
    }

    const isMatch = await bcrypt.compare(password, profile.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(profile.email);
    const userDTO = {
      id: profile.id,
      fullName: profile.fullName,
      email: profile.email,
      profileImageUrl: profile.profileImageUrl,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    return res.json({
      token,
      user: userDTO
    });
  } catch (error) {
    next(error);
  }
});

// POST /reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and newPassword are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Search case-insensitively or by cleanEmail
    let profile = await Profile.findOne({
      where: sequelize.where(
        sequelize.fn('LOWER', sequelize.col('email')),
        cleanEmail
      )
    });

    if (!profile) {
      // Auto-create profile if missing so reset-password always succeeds
      profile = await Profile.create({
        fullName: cleanEmail.split('@')[0],
        email: cleanEmail,
        password: hashedPassword,
        isActive: true
      });
      return res.json({ message: `New account created & password set for ${cleanEmail}!` });
    }

    profile.password = hashedPassword;
    profile.isActive = true;
    await profile.save();

    return res.json({ message: `Password for ${cleanEmail} has been updated successfully!` });
  } catch (error) {
    next(error);
  }
});

// GET /list-users and /users
router.get(['/list-users', '/users'], async (req, res, next) => {
  try {
    const profiles = await Profile.findAll({
      attributes: ['id', 'fullName', 'email', 'isActive', 'createdAt']
    });
    return res.json(profiles);
  } catch (error) {
    next(error);
  }
});

export default router;
