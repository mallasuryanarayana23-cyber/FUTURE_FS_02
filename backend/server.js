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

// Middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
} else {
  // Disable Content Security Policy (CSP) in development to prevent Chrome DevTools internal warnings
  app.use(helmet({
    contentSecurityPolicy: false,
  }));
}
// CORS Configuration - allow all Vercel deployments (preview + production) and local dev
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (Postman, curl, mobile apps)
    if (!origin) return callback(null, true);

    const isVercel = /^https:\/\/.*\.vercel\.app$/.test(origin);
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin);

    if (isVercel || isLocalhost) {
      return callback(null, true);
    }

    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
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
