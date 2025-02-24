require('dotenv').config();
const express = require('express');
const shortid = require('shortid');
const validUrl = require('valid-url');
const mongoose = require('mongoose');
const validator = require('validator');
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3000; 

const mongoUri = process.env.MONGODB_URI;

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

const urlSchema = new mongoose.Schema({
    slug: { type: String, unique: true, required: true },
    targetUrl: { type: String, required: true },
});

const Url = mongoose.model('Url', urlSchema);

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later."
});

app.use('/shorten', limiter);

app.post('/shorten', async (req, res) => {
    const { targetUrl, customSlug } = req.body;

    if (!targetUrl || !validator.isURL(targetUrl)) {
        return res.status(400).json({ error: 'Invalid target URL' });
    }

    const slug = customSlug && validator.isAlphanumeric(customSlug) ? customSlug : shortid.generate();
    const shortUrl = `${req.protocol}://${req.get('host')}/${slug}`;

    try {
        const newUrl = new Url({ slug, targetUrl });
        await newUrl.save();
        res.status(201).json({ shortUrl, targetUrl });
    } catch (err) {
        console.error("Error saving to MongoDB:", err);
        if (err.code === 11000 && err.name === 'MongoServerError') {
            return res.status(409).json({ error: 'Custom slug already exists' });
        }
        return res.status(500).json({ error: 'Error creating shortened URL' });
    }
});

app.get('/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        const url = await Url.findOne({ slug });
        if (!url) {
            return res.status(404).json({ error: 'Shortened URL not found' });
        }
        res.redirect(301, url.targetUrl);
    } catch (err) {
        console.error("Error retrieving from MongoDB:", err);
        return res.status(500).json({ error: 'Error retrieving URL' });
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = { app, Url };