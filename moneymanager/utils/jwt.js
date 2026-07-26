import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '2b8e7c7e-4e2a-4b1a-9c2e-8f7e2d3c4b5a';

export const generateToken = (email) => {
  return jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '10h' });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
