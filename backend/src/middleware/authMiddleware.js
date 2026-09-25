const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protects a route by verifying the Bearer JWT in the Authorization header.
 * On success, attaches { id, username, email, role } to req.user.
 */
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    const message =
      err.name === 'TokenExpiredError'
        ? 'Token has expired. Please log in again.'
        : 'Invalid token. Authorization denied.';

    return res.status(401).json({ success: false, message });
  }

  // Attach a minimal, safe user object — no password
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'The user belonging to this token no longer exists.'
    });
  }

  req.user = user;
  next();
};

module.exports = { protect };
