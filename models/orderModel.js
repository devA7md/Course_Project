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
      enum: ["Preparation", "Picked by the courier", "Arriving"]
    }
  },
  discount: {
    type: Number,
    default: 0
  },
  totalCost: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('orders', orderSchema);
