const db = require('../config/db');

// POST /api/payments
// User thanh toán cho booking
exports.createPayment = async (req, res) => {
  const userId = req.user.id;
  const { booking_id, method } = req.body;

  if (!booking_id || !method) {
    return res.status(400).json({ message: 'Vui long cung cap booking_id va method.' });
  }

  const allowedMethods = ['CASH', 'BANK_TRANSFER', 'MOMO', 'VNPAY'];
  if (!allowedMethods.includes(String(method).toUpperCase())) {
    return res.status(400).json({
      message: `Phuong thuc thanh toan khong hop le. Cho phep: ${allowedMethods.join(', ')}`,
    });
  }

  try {
    // Kiểm tra booking thuộc về user này
    const [bookings] = await db.query(
      'SELECT id, status, total_price FROM bookings WHERE id = ? AND user_id = ? LIMIT 1',
      [Number(booking_id), userId],
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Khong tim thay booking.' });
    }

    const booking = bookings[0];

    if (booking.status === 'CANCELLED') {
      return res.status(400).json({ message: 'Booking nay da bi huy, khong the thanh toan.' });
    }

    if (booking.status === 'COMPLETED') {
      return res.status(400).json({ message: 'Booking nay da hoan thanh.' });
    }

    // Kiểm tra đã thanh toán thành công chưa
    const [existingPayments] = await db.query(
      "SELECT id FROM payments WHERE booking_id = ? AND status = 'SUCCESS' LIMIT 1",
      [booking_id],
    );

    if (existingPayments.length > 0) {
      return res.status(400).json({ message: 'Booking nay da duoc thanh toan thanh cong roi.' });
    }

    const paid_at = new Date();

    const [result] = await db.query(
      'INSERT INTO payments (booking_id, amount, method, status, paid_at) VALUES (?, ?, ?, ?, ?)',
      [booking_id, booking.total_price, method.toUpperCase(), 'SUCCESS', paid_at],
    );

    // Cập nhật booking thành CONFIRMED sau khi thanh toán
    await db.query("UPDATE bookings SET status = 'CONFIRMED' WHERE id = ?", [booking_id]);

    return res.status(201).json({
      message: 'Thanh toan thanh cong.',
      payment: {
        id: result.insertId,
        booking_id: Number(booking_id),
        amount: booking.total_price,
        method: method.toUpperCase(),
        status: 'SUCCESS',
        paid_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Khong the xu ly thanh toan luc nay.', error: error.message });
  }
};

// GET /api/payments/booking/:bookingId
// User/Admin xem lịch sử thanh toán của 1 booking
exports.getPaymentsByBookingId = async (req, res) => {
  const userId = req.user.id;
  const bookingId = Number(req.params.bookingId);

  if (!Number.isInteger(bookingId) || bookingId <= 0) {
    return res.status(400).json({ message: 'Ma booking khong hop le.' });
  }

  try {
    // Xác nhận booking thuộc về user
    const [bookings] = await db.query(
      'SELECT id, total_price, status FROM bookings WHERE id = ? AND user_id = ? LIMIT 1',
      [bookingId, userId],
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Khong tim thay booking.' });
    }

    const [rows] = await db.query(
      'SELECT * FROM payments WHERE booking_id = ? ORDER BY paid_at DESC',
      [bookingId],
    );

    return res.status(200).json({
      message: 'Lay lich su thanh toan thanh cong.',
      payments: rows,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Khong the lay lich su thanh toan.', error: error.message });
  }
};
