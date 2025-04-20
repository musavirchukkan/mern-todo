const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.DB_NAME,
            // These options ensure reliable connections
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle connection errors after initial connection
        mongoose.connection.on('error', err => {
            console.error(`MongoDB connection error: ${err}`);
        });

        // Handle when connection is disconnected
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        // If Node process ends, close the connection
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('MongoDB connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;