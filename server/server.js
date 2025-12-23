const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const settingRoutes = require('./routes/settings');
const mediaRoutes = require('./routes/media');
const uploadRoutes = require('./routes/upload');
const analyticsRoutes = require('./routes/analytics');
const reviewRoutes = require('./routes/reviews');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/', (req, res) => {
  res.send('AHN White+ API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
