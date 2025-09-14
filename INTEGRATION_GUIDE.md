# Backend-Frontend Integration Guide

## Overview
This guide will help you connect your NestJS backend with the React frontend.

## Backend Configuration

### 1. Environment Setup
Create a `.env` file in the backend root directory with the following content:

```env
# Database - Update with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/school-payment

# JWT
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-secure
JWT_EXPIRES_IN=24h

# Payment Gateway
PG_KEY=edvtest01
API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw
SCHOOL_ID=65b0e6293e9f76a9694d84b4

# Server
PORT=3000
NODE_ENV=development
```

### 2. Backend Changes Made
- ✅ Updated CORS configuration to allow frontend connections
- ✅ Added dashboard stats endpoint (`/dashboard/stats`)
- ✅ Added schools endpoint (`/schools`)
- ✅ Added alternative transaction status endpoint (`/transactions/status/:customOrderId`)

## Frontend Configuration

### 1. Environment Setup
Create a `.env` file in the frontend root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000
```

### 2. Frontend Changes Made
- ✅ Updated API base URL from port 3001 to 3000
- ✅ API endpoints now point to correct backend URLs

## Available API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile (requires auth)

### Transactions
- `GET /transactions` - Get all transactions (with pagination/filters)
- `GET /transactions/school/:schoolId` - Get transactions by school
- `GET /transactions/status/:customOrderId` - Get transaction status
- `GET /transactions/transaction-status/:customOrderId` - Alternative status endpoint
- `POST /transactions/dummy-data` - Create dummy data

### Dashboard
- `GET /dashboard/stats` - Get dashboard statistics

### Schools
- `GET /schools` - Get list of schools

### Health
- `GET /health` - Health check

## How to Run Both Applications

### 1. Start the Backend
```bash
cd school-payment-backend
npm install
npm run start:dev
```
The backend will run on `http://localhost:3000`

### 2. Start the Frontend
```bash
cd school-payment-frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`

### 3. Test the Integration
1. Open `http://localhost:5173` in your browser
2. Try to register/login
3. Check if the dashboard loads with data
4. Test transaction functionality

## Troubleshooting

### CORS Issues
If you encounter CORS errors:
1. Make sure the backend is running on port 3000
2. Check that the frontend is running on port 5173
3. Verify the CORS configuration in `src/main.ts`

### API Connection Issues
1. Check that both applications are running
2. Verify the API base URL in the frontend
3. Check browser developer tools for network errors
4. Ensure MongoDB is running and accessible

### Authentication Issues
1. Make sure JWT_SECRET is set in the backend .env file
2. Check that tokens are being stored in localStorage
3. Verify the auth endpoints are working

## Next Steps
1. Set up MongoDB database
2. Create some test users
3. Add more transaction data
4. Customize the frontend UI as needed
5. Deploy both applications

## Notes
- The backend uses JWT for authentication
- All transaction endpoints require authentication
- CORS is configured to allow the frontend domain
- The frontend automatically handles token storage and refresh


