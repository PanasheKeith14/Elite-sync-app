const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createBooking = async (req, res) => {
  try {
    const { serviceId, bookingDate, startTime, endTime, notes } = req.body;

    if (!serviceId || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Conflict detection — check if slot is already taken
    const conflict = await prisma.booking.findFirst({
      where: {
        serviceId,
        status: { not: 'CANCELLED' },
        AND: [
          { startTime: { lt: new Date(endTime) } },
          { endTime:   { gt: new Date(startTime) } }
        ]
      }
    });

    if (conflict) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const booking = await prisma.booking.create({
      data: {
        serviceId,
        userId: req.userId,
        bookingDate: new Date(bookingDate),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        notes,
        status: 'PENDING'
      },
      include: {
        service: { include: { business: true } },
        user: { select: { id: true, fullName: true, email: true } }
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.userId },
      include: {
        service: { include: { business: true } }
      },
      orderBy: { bookingDate: 'asc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: { include: { business: true } },
        user: { select: { id: true, fullName: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const getAvailableSlots = async (req, res) => {
  try {
    const { serviceId, date } = req.query;
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const bookedSlots = await prisma.booking.findMany({
      where: {
        serviceId,
        status: { not: 'CANCELLED' },
        bookingDate: { gte: dayStart, lte: dayEnd }
      },
      select: { startTime: true, endTime: true }
    });

    const allSlots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
    const available = allSlots.filter(slot => {
      const slotTime = new Date(`${date}T${slot}:00`);
      return !bookedSlots.some(b =>
        slotTime >= new Date(b.startTime) && slotTime < new Date(b.endTime)
      );
    });

    res.json({ date, serviceId, availableSlots: available });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getAvailableSlots };