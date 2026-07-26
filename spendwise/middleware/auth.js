import { verifyToken } from '../utils/jwt.js';
import { Profile } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded || !decoded.sub) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  try {
    const profile = await Profile.findOne({ where: { email: decoded.sub } });
    if (!profile) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = profile;
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error in auth middleware', error: error.message });
  }
};
