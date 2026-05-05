const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getAvailableSlots } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/', protect, getAllBookings);
router.put('/:id', protect, updateBookingStatus);
router.get('/slots', getAvailableSlots);

module.exports = router;