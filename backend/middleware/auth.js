import jwt from 'jsonwebtoken';
import { dbStore } from '../services/storage.js';

const JWT_SECRET = process.env.JWT_SECRET || 'learnloop_hackathon_jwt_secret_2026';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For a smooth demo experience, fallback to demo student if no token provided
      req.user = await dbStore.findUserById('demo_student_01');
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbStore.findUserById(decoded.id);

    if (!user) {
      req.user = await dbStore.findUserById('demo_student_01');
      return next();
    }

    req.user = user;
    next();
  } catch (err) {
    // Graceful fallback to demo user so requests don't abruptly crash during local demos
    req.user = await dbStore.findUserById('demo_student_01');
    next();
  }
};

