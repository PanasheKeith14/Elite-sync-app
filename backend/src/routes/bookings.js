const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getAvailableSlots } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/slots', getAvailableSlots);
router.post('/', protect, createBooking);
router.get('/me', protect, getMyBookings);
router.get('/', protect, getAllBookings);
router.put('/:id', protect, updateBookingStatus);

// Get all bookings for the logged-in business owner
router.get('/business', protect, async (req, res) => {
  try {
    const business = await prisma.business.findUnique({ where: { ownerId: req.userId } });
    if (!business) return res.status(404).json({ error: 'No business found' });
    const bookings = await prisma.booking.findMany({
      where: { service: { businessId: business.id } },
      include: {
        user: { select: { id: true, fullName: true, email: true } },
        service: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;