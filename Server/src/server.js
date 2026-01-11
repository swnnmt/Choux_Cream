const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/database');

// Connect to Database
connectDB();

const PORT = config.port;

const { initSocket } = require('./socket');

const server = app.listen(PORT, () => {
  console.log(`Server running in ${config.env} mode on port ${PORT}`);
});

// Initialize Socket.IO
initSocket(server);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
