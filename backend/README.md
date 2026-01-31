# Backend - E-commerce API

## Overview

This is a Node.js/Express backend API for the TrajezzCo e-commerce platform.

## Project Structure

```
backend/
├── config/              # Configuration files (DB, Cloudinary, etc)
├── controllers/         # Request handlers
├── middleware/          # Custom middleware
├── models/             # MongoDB schemas
├── routes/             # API routes
├── services/           # Business logic (Stripe, Mercado Pago, etc)
├── .env               # Environment variables (development)
├── .env.example       # Example environment variables
├── package.json       # Dependencies
└── server.js          # Main server file
```

## Installation

```bash
npm install
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

## Running the Server

### Development (with auto-reload)
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in `.env`)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/users/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

### Payments
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/payments/webhook` - Stripe webhook handler

### Delivery
- `GET /api/delivery/address/:cep` - Get address by CEP
- `POST /api/delivery/calculate` - Calculate shipping cost

## Database

This project uses MongoDB Atlas. Connection string should be in `.env`:

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **stripe**: Payment processing
- **cloudinary**: Image hosting
- **dotenv**: Environment variable management

## Security

- JWT tokens for authentication
- Password hashing with bcryptjs
- CORS configuration
- Input validation with validator
- API rate limiting (recommended for production)

## Troubleshooting

### Port already in use
Change PORT in `.env` to an available port

### MongoDB connection failed
Check your MONGODB_URI in `.env`

### Stripe webhook not working
Ensure STRIPE_WEBHOOK_SECRET is correct and update webhook URL in Stripe dashboard

## Development Notes

- Use `nodemon` for automatic server restart on file changes
- Check logs in the terminal for debugging
- Use Postman or Insomnia to test API endpoints

---

For more information, see [PRODUCTION_READINESS.md](../PRODUCTION_READINESS.md)
