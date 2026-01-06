const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [{
    id: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: String,
    description: String
  }],
  totalAmount: { type: Number, required: true, min: 0 },
  customerEmail: { type: String, required: true, lowercase: true, trim: true },
  paymentStatus: { type: String, enum: ['pending', 'succeeded', 'failed'], default: 'pending' },
  transactionId: { type: String, default: null },
  stripeSessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Async-safe middleware: update updatedAt before save
orderSchema.pre('save', async function() {
  this.updatedAt = Date.now();
});

// format order for JSON responses
orderSchema.methods.toJSON = function() {
  return this.toObject();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
