# E-Commerce Application with Stripe Integration

A full-stack e-commerce application built with React, Node.js, Express, MongoDB, and Stripe payment integration.

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Stripe Account** (for payment processing)
- **Stripe CLI** (for webhook testing in development)

## Project Structure

```
isha-ecom/
├── client/          # React frontend (Vite)
├── server/          # Node.js backend (Express)
└── README.md        # This file
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd isha-ecom
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory with the following variables:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/stripe-ecommerce
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
CLIENT_URL=http://localhost:5173
```

### 3. Client Setup

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_publishable_key_here
```

### 4. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally and ensure it's running on port 27017

**Option B: MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string and update `MONGO_URI` in server `.env`

### 5. Stripe Setup

1. Sign up at [Stripe](https://stripe.com)
2. Get your API keys from the Stripe Dashboard (Developers → API Keys)
3. Add your keys to the respective `.env` files:
   - Secret key → `server/.env`
   - Publishable key → `client/.env`

### 6. Stripe Webhook Setup (Development)

Install Stripe CLI:
```bash
# Windows (using Scoop)
scoop install stripe

# Or download from https://stripe.com/docs/stripe-cli
```

Login to Stripe CLI:
```bash
stripe login
```

Forward webhook events to your local server:
```bash
cd server
stripe listen --forward-to localhost:5000/webhook
```

Copy the webhook signing secret from the CLI output and update `STRIPE_WEBHOOK_SECRET` in `server/.env`.

## Running the Application

### Development Mode

You'll need **three terminal windows**:

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```
Server runs on http://localhost:5000

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

**Terminal 3 - Stripe Webhooks:**
```bash
cd server
stripe listen --forward-to localhost:5000/webhook
```

### Production Mode

**Build the client:**
```bash
cd client
npm run build
```

**Start the server:**
```bash
cd server
npm start
```

## Features

- 🛒 Product catalog
- 🛍️ Shopping cart functionality
- 💳 Stripe checkout integration
- 📦 Order management
- ✅ Payment success/failure handling
- 🔔 Webhook event processing

## API Endpoints

- `GET /health` - Health check
- `GET /api/products` - Get all products
- `POST /api/create-checkout-session` - Create Stripe checkout session
- `GET /api/order/:sessionId` - Get order details
- `POST /webhook` - Stripe webhook handler

## Environment Variables Reference

### Server (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/stripe-ecommerce |
| STRIPE_SECRET_KEY | Stripe secret key | sk_test_... |
| STRIPE_WEBHOOK_SECRET | Stripe webhook signing secret | whsec_... |
| CLIENT_URL | Frontend URL | http://localhost:5173 |

### Client (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000 |
| VITE_STRIPE_PUBLIC_KEY | Stripe publishable key | pk_test_... |

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGO_URI` in server `.env`

### Stripe Webhook Issues
- Ensure Stripe CLI is running and forwarding to the correct URL
- Verify `STRIPE_WEBHOOK_SECRET` matches the CLI output

### CORS Issues
- Ensure `CLIENT_URL` in server `.env` matches your frontend URL

## License

ISC

## Author

Your Name
