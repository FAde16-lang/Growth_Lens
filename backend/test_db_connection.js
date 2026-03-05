const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        console.log("URI:", process.env.MONGODB_URI ? "Found (hidden)" : "Not Found");

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB Connection SUCCESS");
        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("MongoDB Connection FAILED");
        console.error(err.message);
        process.exit(1);
    }
};

connectDB();
