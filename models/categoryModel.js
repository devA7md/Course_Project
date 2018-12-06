const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 64,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'product'
  }]
});

module.exports = mongoose.model('category', categorySchema);
