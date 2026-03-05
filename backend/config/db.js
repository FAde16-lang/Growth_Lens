const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/placeholderDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        // Implement retry logic or graceful exit as needed
        console.log("Could not connect to MongoDB. Ensure MONGODB_URI is set or local mongo is running.");
        // process.exit(1); // Don't crash for placeholder demo if DB missing
    }
};

module.exports = connectDB;
