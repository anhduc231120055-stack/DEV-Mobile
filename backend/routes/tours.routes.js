const express = require('express');

const {
  createTour,
  deleteTour,
  getTourById,
  getTours,
  updateTour,
} = require('../controllers/tours.controller');
const { authenticateAdminToken } = require('../middleware/adminAuth.middleware');

const router = express.Router();

router.get('/', getTours);
router.get('/:id', getTourById);
router.post('/', authenticateAdminToken, createTour);
router.put('/:id', authenticateAdminToken, updateTour);
router.delete('/:id', authenticateAdminToken, deleteTour);

module.exports = router;
