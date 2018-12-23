const mongoose = require('mongoose');
const {Schema} = mongoose;
const Joi = require('joi');

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
    min: 0,
    max: 10000,
    get: (v) => {
      return v;
    },
    set: function (v) {
      return v;
    }
  },
  discount: {
    type: Number,
    required: true,
    min: 0,
    max: 50,
    get: (v) => {
      return v;
    },
    set: function (v) {
      return v;
    }
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
  },
  stock: {
    type: Number
  },
  customer: {
    type: mongoose.ObjectId, // equal to mongoose.Schema.Types.ObjectId
    ref: 'customer'
  }
});

productSchema.statics.productValidation = function (customer) {
  const schema = {
    name: Joi.string().min(8).max(64).required(),
    price: Joi.number().min(0).max(10000).required(),
    discount: Joi.number().required(),
    productInfo: {
      title: Joi.string().required(),
      image: Joi.string().required(),
      description: Joi.string().required(),
      available: Joi.boolean().required(),
      brand: Joi.string(),
    }
  };
  return Joi.validate(customer, schema, {allowUnknown: true});
};

module.exports = mongoose.model('product', productSchema);
