const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ─────────────────────────────────────────────────────────────
// protectRoute — use this on any route that needs login
// Usage:  router.get('/profile', protectRoute, (req, res) => {...})
// ─────────────────────────────────────────────────────────────
const protectRoute = async (req, res, next) => {
  try {
    // 1. Check if Authorization header exists and starts with "Bearer "
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized. Please login.' });
    }

    // 2. Extract the token from "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token || token === 'undefined' || token === 'null' || token.split('.').length !== 3) {
      return res.status(401).json({ message: 'Token invalid. Please login again.' });
    }

    // 3. Verify the token using our JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin') {
      req.user = {
        _id: decoded.userId,
        email: decoded.email,
        username: decoded.username || 'Admin',
        role: 'admin',
        creds: 0,
      };
      return next();
    }

    // 4. Find the user from the token's userId (exclude password)
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    // 5. Attach user to request so next route can use it
    req.user = user;
    next();

  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }

    if (err.name === 'JsonWebTokenError' && /malformed|invalid token/i.test(err.message)) {
      return res.status(401).json({ message: 'Token invalid. Please login again.' });
    }

    console.error('Auth middleware error:', err.message);
    return res.status(401).json({ message: 'Token invalid. Please login again.' });
  }
};

module.exports = { protectRoute };