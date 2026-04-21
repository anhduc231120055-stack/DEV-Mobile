const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

require('dotenv').config();

const adminAuthRoutes = require('../routes/adminAuth.routes');
const authRoutes = require('../routes/auth.routes');
const bookingsRoutes = require('../routes/bookings.routes');
const paymentsRoutes = require('../routes/payments.routes');
const statsRoutes = require('../routes/stats.routes');
const toursRoutes = require('../routes/tours.routes');
const usersRoutes = require('../routes/users.routes');

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173,http://localhost:8081,http://10.0.2.2:8081')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('CORS origin is not allowed'));
    },
    credentials: true,
  }),
);
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    message: 'API is running',
    allowedOrigins,
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    message: 'Internal server error',
  });
});

module.exports = app;
