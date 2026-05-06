const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const serviceRoutes  = require('./routes/services');
const bookingRoutes  = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5000;

// Updated CORS configuration to allow your specific Vercel URL
app.use(cors({
  origin: ["https://elite-sync-app.vercel.app", "http://localhost:5173"],
  credentials: true
}));

app.use(express.json());

app.use('/api/auth',     authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health Check: https://elitesync-backend.onrender.com/api/health`);
});