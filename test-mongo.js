// test-mongo.js
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connection successful!');
    mongoose.disconnect(); // Close the connection after the test
}).catch(err => {
    console.error('MongoDB connection error:', err);
});