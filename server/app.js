const express = require('express');
const cors = require('cors');
const projectRoutes = require('./routes/projectRoutes');
const searchRoutes = require('./routes/searchRoutes');
const ragRoutes = require('./routes/ragRoutes');
const verificationRoutes = require('./routes/verificationRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/projects', projectRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/summaries', ragRoutes);
app.use('/api/verification', verificationRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = app;
