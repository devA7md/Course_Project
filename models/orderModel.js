const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderNumber: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    emun: ["Ready for Shipping", "Shipped", "Delivered"]
  },
  shipmentInfo: {
    shippingFees: {
      type: Number,
      required: true,
    },
    shipmentTracking: {
      type: String,
      required: true,
      enum: ["preparation", "picked by the courier", "Arriving"]
    }
  },
  discount: {
    type: Number
  },
  totalCost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('orders', orderSchema);
