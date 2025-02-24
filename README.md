# Alumier MD URL Shortener API

This project implements a URL shortening web service for Alumier MD using Node.js, Express.js, and MongoDB. It provides an API for creating shortened URLs and redirecting to the original target URLs.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Running the Service](#running-the-service)
- [Running the Tests](#running-the-tests)
- [API Endpoints](#api-endpoints)
- [Design Decisions](#design-decisions)
- [Scalability Considerations](#scalability-considerations)
- [Security Considerations](#security-considerations)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Introduction

This URL shortener service allows Alumier MD to create shortened URLs that redirect to target URLs. Users can specify a custom "slug" for the shortened URL, or the service will generate a unique one. This service is API-only, designed for integration with other systems.

## Features

- Create shortened URLs with optional custom slugs.
- Generate unique slugs if none are provided.
- Redirect from shortened URLs to target URLs.
- Comprehensive test suite.
- Rate limiting to prevent abuse.

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose (MongoDB interaction)
- shortid (slug generation)
- valid-url (URL validation)
- validator (input validation)
- express-rate-limit (rate limiting)
- Jest and Supertest (testing)
- dotenv (environment variables management)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Samnoble118/URL-Shortener
   ```
2. Navigate to the project directory:
   ```sh
   cd <project_directory>
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Create a `.env` file in the root directory and add your MongoDB connection string:
   ```sh
   MONGODB_URI=mongodb+srv://samnoble118:<your_password>@<your_cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
   **(Keep your password and cluster name private.)**

## Running the Service

1. Start the MongoDB server (if not already running).
2. Start the application:
   ```sh
   node server.js
   ```
3. The server will start listening on port 3000 (or the port specified in your `.env` file).

## Running the Tests

1. Ensure that the MongoDB server is running.
2. Run the test suite:
   ```sh
   npm run test:sequential
   ```
   Or alternatively:
   ```sh
   npm test --runInBand
   ```

## API Endpoints

### `POST /shorten`

Creates a shortened URL.

**Request Body (JSON):**

```json
{
  "targetUrl": "https://www.example.com",
  "customSlug": "my-custom-slug"
}
```

### `GET /:slug`

Redirects to the target URL.

**Example:**
```sh
GET http://localhost:3000/my-custom-slug
```
Redirects to:
```sh
https://www.example.com
```

## Design Decisions

### Language and Framework
Node.js and Express.js were chosen for their widespread industry adoption, ease of use, extensive community support, and rapid development capabilities. These technologies are well-suited for building efficient API services.

### Database
MongoDB was selected as the database due to its NoSQL nature, making it well-suited for storing URL mappings. Its flexible schema allows easy adaptation if additional features are added.

### Slug Generation
The `shortid` library is used to generate unique slugs when no custom slug is provided. `shortid` creates short, URL-friendly identifiers.

### Error Handling
- Invalid URLs are detected using `valid-url` and `validator`.
- Duplicate custom slugs result in a `409 Conflict` response.
- Database connection errors are caught to prevent inconsistent states.

### Input Validation
- `valid-url` and `validator` ensure valid `targetUrl` inputs.
- `validator.isAlphanumeric()` ensures `customSlug` contains only alphanumeric characters.

### Rate Limiting
The `express-rate-limit` package limits requests to `/shorten` to 100 per 15 minutes, preventing abuse while allowing legitimate usage.

### Database Schema
The `Url` model in MongoDB contains:
- `slug` (String, unique, required)
- `targetUrl` (String, required)

## Scalability Considerations

To improve scalability:
- **Database sharding** can distribute data across multiple servers.
- **Caching** frequently accessed URLs using Redis or Memcached can enhance performance.
- **Load balancing** can distribute traffic across multiple instances.
- **Indexing** the `slug` field can improve query performance.

## Security Considerations

- **Input validation** prevents injection attacks.
- **Rate limiting** mitigates abuse.
- **HTTPS** should be used for all communication.
- **Environment variables** should store sensitive information like the MongoDB connection string.

## Future Improvements

- Add a user interface for managing shortened URLs.
- Implement analytics to track clicks on shortened URLs.
- Support custom short domains.
- Improve error handling and logging.

## Author

**Sam Noble**  
📧 [samnoble118@icloud.com](mailto:samnoble118@icloud.com)  
🌐 [Portfolio](https://samnoble118.github.io/Sam-s-Portfolio-2025/)