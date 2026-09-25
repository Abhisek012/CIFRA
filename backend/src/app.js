const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Basic CORS setup
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route greeting
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Cifra API Server',
    docs: '/api/v1/health'
  });
});

// API v1 Routes
app.use('/api/v1', apiRoutes);

// Fallback 404 Route Handler
app.use(notFound);

// Central Error Handling Middleware
app.use(errorHandler);

module.exports = app;
