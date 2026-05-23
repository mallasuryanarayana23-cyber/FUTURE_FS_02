const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

// Connect to database
connectDB();

const app = express();

// ─── Manual CORS headers (works with Express 5, bypasses all package issues) ──
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  // Respond immediately to preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});
// ─────────────────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/followups', require('./routes/followUpRoutes'));

// Root Route (Server Health Check)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'online', message: 'NexusCRM API Server is running' });
});

// Error Handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
