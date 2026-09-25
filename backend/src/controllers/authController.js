const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Helper — returns only the safe fields we want to expose in API responses
const safeUser = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  bio: user.bio,
  role: user.role,
  createdAt: user.createdAt
});

// ─── POST /api/v1/auth/register ─────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic field presence validation
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
        errors: ['username, email, and password are all required']
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors: ['Password must be at least 6 characters']
      });
    }

    // Duplicate check
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase() ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        message: `${field} is already in use.`,
        errors: [`${field} already exists`]
      });
    }

    const user = await User.create({ username, email, password });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: { user: safeUser(user) }
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/v1/auth/login ─────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
        errors: ['email and password are required']
      });
    }

    // Explicitly select password back (schema has select: false)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        token,
        user: safeUser(user)
      }
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/v1/auth/me  (protected) ───────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is already populated by the protect middleware (no password field)
  return res.status(200).json({
    success: true,
    message: 'Authenticated user fetched successfully.',
    data: { user: safeUser(req.user) }
  });
};

module.exports = { register, login, getMe };
