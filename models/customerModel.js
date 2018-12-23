const mongoose = require('mongoose');
const {Schema} = mongoose;
const Joi = require('joi');
const bcrybt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 64,
  },
  username: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 16,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 64,
    unique: true
  },
  phone: {
    type: Number,
    required: true,
    validate: {
      validator: function (value) {
        const strVal = value.toString();
        return strVal.length <= 16 && strVal.length >= 6;
      },
      message: props => `${props.value} is not valid - must be between 6 - 16`
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 1024
  },
  accountType: {
    type: String,
    default: 'Standard',
    enum: ['Standard', 'Premium', 'Enterprise']
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'product'
  }],
  address: {
    country: {
      type: String,
      required: true
    },
    street: String,
    state: String,
    city: String,
    postalCode: Number,
    phone: Number
  },
  creditCard: {
    firstName: String,
    lastName: String,
    cardType: String,
    expiryDate: Date,
    securityCode: String
  },
  shippingInfo: {
    street: String,
    country: String,
    state: String,
    city: String,
    postalCode: Number,
    phone: Number
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

customerSchema.pre('save', async function () {
  this.password = await bcrybt.hash(this.password, 10);
});

customerSchema.methods.comparePassword = function (password) {
  return bcrybt.compare(password, this.password);
};

customerSchema.methods.generateToken = function () {
  const payload = {
    id: this._id,
    type: this.accountType,
    admin: this.isAdmin
  };

  return jwt.sign(payload, config.get('secretToken'));
};

customerSchema.statics.signupValidation = function (customer) {
  const schema = {
    name: Joi.string().min(4).max(64).required(),
    username: Joi.string().min(4).max(16).required(),
    email: Joi.string().email().min(5).max(64).required(),
    phone: Joi.number().required(),
    password: Joi.string().min(8).max(1024).required(),
    accountType: Joi.string(),
    address: {
      country: Joi.string().required()
    }
  };
  return Joi.validate(customer, schema, {allowUnknown: true});
};

customerSchema.statics.loginValidation = function (customer) {
  const schema = {
    username: Joi.string().min(4).max(16).required(),
    password: Joi.string().min(8).max(1024).required()
  };
  return Joi.validate(customer, schema);
};

module.exports = mongoose.model('customer', customerSchema);
