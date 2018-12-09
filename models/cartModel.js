const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true
  },
  product: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'product'
  }]
});

module.exports = mongoose.model('cart', cartSchema);
