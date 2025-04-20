const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet()); // Set security HTTP headers

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later'
    }
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10kb' })); // Body limit to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/todos', require('./routes/todoRoutes'));

// Default route (health check)
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Todo API is running'
    });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

// 404 handler for routes not found - MUST BE BEFORE error handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

// Global error handler - MUST BE LAST
app.use(errorHandler);

// Port
const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    // Close server & exit process
    server.close(() => {
        process.exit(1);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    process.exit(1);
});

module.exports = app; // For testing purposes