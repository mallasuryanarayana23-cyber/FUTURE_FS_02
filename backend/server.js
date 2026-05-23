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

// ─── CORS must come BEFORE helmet and all other middleware ───────────────────
// We use JWT Bearer tokens (not cookies), so origin:'*' is safe here
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// ─────────────────────────────────────────────────────────────────────────────

// Security headers (after CORS so it doesn't interfere with preflight)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({ crossOriginResourcePolicy: false }));
} else {
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: false }));
}

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
