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
      // No token: return 401 so the frontend knows it needs to provision a session
      return res.status(401).json({ error: 'Authentication required. Please sign in or start a guest session.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await dbStore.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User account not found. Please sign in again.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await dbStore.findUserById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
  } catch (err) {
    // Continue unauthenticated
  }
  next();
};

