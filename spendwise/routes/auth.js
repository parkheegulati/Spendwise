import express from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Profile } from '../models/index.js';
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

    // Check if email SMTP credentials are set
    const hasSmtp = Boolean(process.env.BREVO_USERNAME && process.env.BREVO_PASSWORD);
    // If SMTP is not configured, auto-activate account so dev testing works seamlessly
    const autoActivate = !hasSmtp;

    let profile = await Profile.findOne({ where: { email } });
    if (profile) {
      if (profile.isActive) {
        return res.status(400).json({ message: 'Email already registered' });
      } else {
        // Update existing inactive profile
        profile.fullName = fullName;
        profile.password = hashedPassword;
        profile.profileImageUrl = profileImageUrl || profile.profileImageUrl;
        profile.isActive = autoActivate;
        profile.activationToken = autoActivate ? null : activationToken;
        await profile.save();
      }
    } else {
      profile = await Profile.create({
        fullName,
        email,
        password: hashedPassword,
        profileImageUrl: profileImageUrl || '',
        isActive: autoActivate,
        activationToken: autoActivate ? null : activationToken
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

// POST /login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const profile = await Profile.findOne({ where: { email } });
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

    const profile = await Profile.findOne({ where: { email } });
    if (!profile) {
      return res.status(404).json({ message: 'User with this email not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    profile.password = hashedPassword;
    profile.isActive = true;
    await profile.save();

    return res.json({ message: `Password for ${email} has been updated successfully!` });
  } catch (error) {
    next(error);
  }
});

export default router;
