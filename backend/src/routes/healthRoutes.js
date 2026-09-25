const express = require('express');
const router = express.Router();

/**
 * @route   GET /api/v1/health
 * @desc    Health check endpoint to verify API server status
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Cifra API is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;
