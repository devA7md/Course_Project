const express = require('express');
const router = express.Router();

const {loggedIn} = require('../middlwares/authentication');

const Cart = require('../models/cartModel');
const Customer = require('../models/customerModel');

// get the cart based on customer id
router.get('/mycart', loggedIn, async (req, res) => {
  const {id} = req.user;

  const cart = await Cart.findOne({customer: id})
    .select('products -_id')
    .populate({
      path: 'products',
      select: 'name price discount -_id'
    });

  if (!cart) return res.status(404).send('No cart found');

  const {products, quantity, totalCost} = cart;
  res.send({products, quantity, totalCost});
});

// update a cart if it found or create a new one
router.post('/', loggedIn, async (req, res) => {
  const {productId} = req.query,
    customerId = req.user.id;

  const customer = await Customer.findById(customerId);
  if (
    !(customer.toObject().hasOwnProperty('shippingInfo') &&
      customer.toObject().hasOwnProperty('creditCard'))
  )
    return res.status(400).send('You have to update your shipping and credit card information');

  const existingCart = await Cart.findOne({customer: customerId});

  if (existingCart) {
    const updatedCart = await Cart
      .findOneAndUpdate(
        {customer: customerId},
        {$push: {products: productId}},
        {new: true}
      )
      .populate({
        path: 'products',
        select: 'name price discount -_id'
      });

    const {products, quantity, totalCost} = updatedCart;
    res.send({products, quantity, totalCost});

  } else {
    const cart = new Cart({});

    cart.set('customer', customerId);
    cart['products'].push(productId);

    await cart.save();

    const savedCart = await Cart.findOne({customer: customerId})
      .populate({
        path: 'products',
        select: 'name price discount -_id'
      })
      .select('product -_id');

    const {products, quantity, totalCost} = savedCart;
    res.send({products, quantity, totalCost});
  }
});

// delete a cart based on customer id
router.delete('/mycart', loggedIn, async (req, res) => {
  const {id} = req.user;

  await Cart.deleteOne({customer: id});
  res.send('Deleted');
});

module.exports = router;
