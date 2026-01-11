const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config/env');
const errorHandler = require('./middlewares/error.middleware');

// Import routes
const authRoutes = require('./routes/auth.routes');
const friendRoutes = require('./routes/friend.routes');
const postRoutes = require('./routes/post.routes');
const notificationRoutes = require('./routes/notification.routes');
const upload = require('./routes/upload.route');
const userRoutes = require('./routes/user.routes');
const app = express();

// Middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', upload );


// Base route
app.get('/', (req, res) => {
  res.send('Locket Clone API is running...');
});

// Error Handler (Should be last middleware)
app.use(errorHandler);

module.exports = app;
