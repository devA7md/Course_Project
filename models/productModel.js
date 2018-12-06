const mongoose = require('mongoose');
const {Schema} = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
  productInfo: {
    title: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    available: {
      type: Boolean,
      required: true
    },
    brand: {
      type: String
    }
  }
});

module.exports = mongoose.model('product', productSchema);
