# Database Setup Guide

## Option 1: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/atlas
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Create a `.env` file in your backend root with:

```env
# Database - Using MongoDB Atlas (cloud database)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/school-payment?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure-12345
JWT_EXPIRES_IN=24h

# Payment Gateway
PG_KEY=edvtest01
API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Server
PORT=3000
NODE_ENV=development
```

## Option 2: Local MongoDB (Alternative)

1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install it
3. Start MongoDB service
4. Use this in your `.env` file:

```env
MONGODB_URI=mongodb://localhost:27017/school-payment
```

## Option 3: Docker MongoDB (Quick Setup)

If you have Docker installed:

```bash
docker run --name mongodb -p 27017:27017 -d mongo:latest
```

Then use:
```env
MONGODB_URI=mongodb://localhost:27017/school-payment
```

## Quick Test Database (Temporary)

For immediate testing, I'll create a simple in-memory database option.


