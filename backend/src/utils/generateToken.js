const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT containing the user's id and role.
 * Reads JWT_SECRET and JWT_EXPIRES_IN from environment variables.
 *
 * @param {string} id   - The user's MongoDB ObjectId
 * @param {string} role - The user's role ("user" | "admin")
 * @returns {string}    - Signed JWT string
 */
const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
