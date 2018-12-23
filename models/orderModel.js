const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  orderNumber: {
    type: Number,
    // required: true,
    // unique: true
  },
  status: {
    type: String,
    emun: ["Ready for Shipping", "Shipped", "Delivered"],
    required: true
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
  products: [{
    type: mongoose.ObjectId,
    ref: 'product'
  }],
  customer: {
    type: mongoose.ObjectId,
    ref: 'customer'
  }
});

// using virtual keys for quantity and totalCost instead of saving them to mongodb
orderSchema.virtual('quantity').get(function () {
  return this.products.length;
});

orderSchema.virtual('totalCost').get(function () {
  return this.products
    .map(product => product.price)  // return something like that [150, 220, 268, ...]
    .reduce((total, price) => total + price); // return total price
});

orderSchema.pre('save', function () {
  console.log(this);
  this.products.push('5c193fe981f57310d8c17238');
});

module.exports = mongoose.model('orders', orderSchema);
