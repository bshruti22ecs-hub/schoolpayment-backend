# School Payment Backend

A clean NestJS backend for school payment management with MongoDB database connection through environment variables.

## 🚀 Features

- **JWT Authentication**: Secure user authentication and authorization
- **Payment Gateway Integration**: Seamless integration with payment providers
- **Webhook Processing**: Real-time payment status updates
- **Transaction Management**: Complete transaction tracking and reporting
- **MongoDB Connection**: Database connection through environment variables
- **Data Validation**: Comprehensive input validation using class-validator
- **Error Handling**: Robust error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn package manager

## 🛠️ Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your database configuration:
   ```env
   # Database - Update with your MongoDB connection string
   MONGODB_URI=mongodb://localhost:27017/school-payment
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h
   
   # Payment Gateway
   PG_KEY=edvtest01
   API_KEY=your-payment-gateway-api-key
   SCHOOL_ID=your-school-id
   
   # Server
   PORT=3000
   NODE_ENV=development
   ```

3. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

## 🔗 Database Connection

The application connects to MongoDB using the `MONGODB_URI` environment variable. You can use:

- **Local MongoDB**: `mongodb://localhost:27017/school-payment`
- **MongoDB Atlas**: `mongodb+srv://username:password@cluster.mongodb.net/school-payment`
- **Custom MongoDB**: Any valid MongoDB connection string

## 🔌 API Endpoints

- **Authentication**: `/auth/register`, `/auth/login`, `/auth/profile`
- **Payments**: `/payment/create-payment`, `/payment/status/:orderId`
- **Webhooks**: `/webhook`, `/webhook/logs`
- **Transactions**: `/transactions`, `/transactions/school/:schoolId`

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 📝 Error Handling

The API returns consistent error responses with proper HTTP status codes and descriptive messages.

---

**Note**: Make sure to update the `MONGODB_URI` in your `.env` file with your actual database connection string.
