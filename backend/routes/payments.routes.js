const express = require('express');

const {
  createPayment,
  getPaymentsByBookingId,
} = require('../controllers/payments.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/', authenticateToken, createPayment);
router.get('/booking/:bookingId', authenticateToken, getPaymentsByBookingId);

module.exports = router;
