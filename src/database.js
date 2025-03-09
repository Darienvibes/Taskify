require('dotenv').config();
const mongoose = require('mongoose');

async function connectDB() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is missing in .env file');
        }

        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB!');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
    }
}

module.exports = connectDB;