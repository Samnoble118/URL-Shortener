const request = require('supertest');
const { app, Url } = require('./server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }

});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('URL Shortener API', () => {
    it('should shorten a URL', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ targetUrl: 'https://www.google.com', customSlug: 'test-google' }); // Use a real URL
        expect(res.statusCode).toEqual(201);
        expect(res.body.shortUrl).toBeDefined();
        expect(res.body.targetUrl).toEqual('https://www.google.com'); // Match the actual URL
        await Url.deleteOne({ slug: 'test-google' });
    });

    it('should shorten a URL with a generated slug', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ targetUrl: 'https://www.google.com' }); // Use a real URL
        expect(res.statusCode).toEqual(201);
        expect(res.body.shortUrl).toBeDefined();
        expect(res.body.targetUrl).toEqual('https://www.google.com'); // Match the actual URL
    });

    it('should shorten a URL with a custom slug', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ targetUrl: 'https://www.google.com', customSlug: 'my-google-slug' }); // Use a real URL
        expect(res.statusCode).toEqual(201);
        expect(res.body.shortUrl).toContain('my-google-slug');
        expect(res.body.targetUrl).toEqual('https://www.google.com'); // Match the actual URL
    });

    it('should handle duplicate custom slugs', async () => {
        await request(app)
            .post('/shorten')
            .send({ targetUrl: 'https://www.google.com', customSlug: 'duplicate-google-slug' }); // Use a real URL

        const res = await request(app)
            .post('/shorten')
            .send({ targetUrl: 'https://www.bing.com', customSlug: 'duplicate-google-slug' }); // Use a real URL
        expect(res.statusCode).toEqual(409);
        expect(res.body.error).toEqual('Custom slug already exists');
    });

    it('should redirect to the original URL', async () => {
        const targetUrl = 'https://www.google.com'; // Use a real URL
        const resShorten = await request(app)
            .post('/shorten')
            .send({ targetUrl });
        const shortUrl = resShorten.body.shortUrl;
        const slug = shortUrl.split('/').pop();

        const resRedirect = await request(app)
            .get(`/${slug}`);

        expect(resRedirect.statusCode).toEqual(301);
        expect(resRedirect.headers.location).toEqual(targetUrl);
    });

    it('should handle invalid URLs', async () => {
        const res = await request(app)
            .post('/shorten')
            .send({ targetUrl: 'invalid-url' });
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toEqual('Invalid target URL');
    });

    it('should handle non-existent slugs', async () => {
        const res = await request(app)
            .get('/non-existent-slug');
        expect(res.statusCode).toEqual(404);
        expect(res.body.error).toEqual('Shortened URL not found');
    });
});