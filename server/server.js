const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe');
const connectDB = require('./db/db');
const Order = require('./model/order');

// load the env variables
dotenv.config();

// initialize express app
const app = express();

// initialize stripe
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

// connect to database
connectDB();

// for handling CORS issues
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// stripe webhook endpoint - to handle events from stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;

  try {
    event = stripeClient.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook received:', event.type);
  } catch (err) {
    console.log(`❌ Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      const sessionCompleted = event.data.object;
      
      try {
        const order = await Order.findOne({ stripeSessionId: sessionCompleted.id });
        if (order) {
          order.paymentStatus = 'succeeded';
          order.transactionId = sessionCompleted.payment_intent;
          await order.save();
          console.log('✅ Order updated successfully:', order._id);
        } else {
          console.log('⚠️ Order not found for session:', sessionCompleted.id);
        }
      } catch (error) {
        console.error('❌ Error updating order:', error);
      }
      break;

    case 'checkout.session.expired':
    case 'payment_intent.payment_failed':
      const sessionExpired = event.data.object;
      
      try {
        const order = await Order.findOne({ 
          stripeSessionId: sessionExpired.id || sessionExpired.latest_charge 
        });
        if (order) {
          order.paymentStatus = 'failed';
          await order.save();
          console.log('✅ Order marked as failed:', order._id);
        }
      } catch (error) {
        console.error('❌ Error updating failed order:', error);
      }
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// middleware to parse JSON bodies
app.use(express.json());

// normal routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get all products (mock data)
app.get('/api/products', (req, res) => {
  const products = [
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 79.99, 
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', 
      description: 'High-quality wireless headphones with noise cancellation' 
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 199.99, 
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 
      description: 'Feature-rich smartwatch with health tracking' 
    },
    { 
      id: 3, 
      name: 'Laptop Stand', 
      price: 49.99, 
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop', 
      description: 'Ergonomic laptop stand for better posture' 
    },
    { 
      id: 4, 
      name: 'USB-C Cable', 
      price: 19.99, 
      image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&h=500&fit=crop', 
      description: 'Fast charging USB-C cable, 6ft long' 
    },
    { 
      id: 5, 
      name: 'Mechanical Keyboard', 
      price: 129.99, 
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&h=500&fit=crop', 
      description: 'RGB mechanical keyboard with Cherry MX switches' 
    },
    { 
      id: 6, 
      name: 'Wireless Mouse', 
      price: 39.99, 
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', 
      description: 'Ergonomic wireless mouse with precision tracking' 
    },
    { 
      id: 7, 
      name: 'Phone Case', 
      price: 24.99, 
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500&h=500&fit=crop', 
      description: 'Protective phone case with sleek design' 
    },
    { 
      id: 8, 
      name: 'Portable Charger', 
      price: 34.99, 
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop', 
      description: '20000mAh portable power bank' 
    }
  ];
  
  res.json(products);
});

// Create checkout session
app.post('/api/create-checkout-session', async (req, res) => {
  const { items, email } = req.body;
  
  // Validation
  if (!email || !items || items.length === 0) {
    return res.status(400).json({ 
      error: 'Email and items are required',
      details: 'Please provide a valid email and at least one item'
    });
  }

  // Email validate
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format',
      details: 'Please provide a valid email address'
    });
  }

  try {
    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid total amount',
        details: 'Total amount must be greater than 0'
      });
    }

    // Create Stripe checkout session - map items to Stripe format
    const session = await stripeClient.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.description || '',
            images: item.image ? [item.image] : []
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/failed`,
      customer_email: email,
      metadata: {
        customerEmail: email
      }
    });

    console.log('Creating Stripe session with items:', items); // debug
console.log('Email:', email);
console.log('Client URL:', process.env.CLIENT_URL);
console.log('Stripe Key:', process.env.STRIPE_SECRET_KEY ? 'OK' : 'MISSING'); 


    // Create order in database
    const order = new Order({
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        description: item.description
      })),
      totalAmount,
      customerEmail: email,
      paymentStatus: 'pending',
      stripeSessionId: session.id,
    });

    await order.save();

    console.log('✅ Order created:', order._id);
    console.log('✅ Stripe session created:', session.id);

    res.json({ 
      url: session.url, 
      orderId: order._id,
      sessionId: session.id
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message 
    });
  }
});

// Get order by session ID
app.get('/api/order/:sessionId', async (req, res) => {
  try {
    const order = await Order.findOne({ stripeSessionId: req.params.sessionId });
    
    if (!order) {
      return res.status(404).json({ 
        error: 'Order not found',
        details: 'No order found with the provided session ID'
      });
    }
    
    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
});

// Get all orders (for admin/testing purposes)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50);
    res.json({
      count: orders.length,
      orders
    });
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
});

// Get order statistics
app.get('/api/orders/stats', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const successfulOrders = await Order.countDocuments({ paymentStatus: 'succeeded' });
    const failedOrders = await Order.countDocuments({ paymentStatus: 'failed' });
    const pendingOrders = await Order.countDocuments({ paymentStatus: 'pending' });
    
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'succeeded' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      totalOrders,
      successfulOrders,
      failedOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0
    });
  } catch (error) {
    console.error('❌ Error fetching statistics:', error);
    res.status(500).json({ 
      error: 'Failed to fetch statistics',
      details: error.message 
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   🚀 Server is running on port ${PORT}   ║
║   📡 Environment: ${process.env.NODE_ENV || 'development'}           ║
║   🌐 Client URL: ${process.env.CLIENT_URL}  ║
╚════════════════════════════════════════╝
  `);
});