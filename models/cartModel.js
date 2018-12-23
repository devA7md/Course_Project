const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }],
  customer: {
    type: mongoose.ObjectId,
    ref: 'customer'
  },
  expiryDate: {
    type: Date,
    default: new Date()
  }
});

cartSchema.index({expiryDate: 1}, {expireAfterSeconds: 24 * 60 * 60});

// using virtual keys for quantity and totalCost instead of saving them to mongodb
cartSchema.virtual('quantity').get(function () {
  return this.products.length;
});

cartSchema.virtual('totalCost').get(function () {
  return this.products
    .map(product => product.price)  // return something like that [150, 220, 268, ...]
    .reduce((total, price) => total + price); // return total price
});

module.exports = mongoose.model('cart', cartSchema);
