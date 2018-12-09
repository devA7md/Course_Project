const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');

router.post('/', async (req, res) => {
  const {quantity, totalCost, product} = req.body;
  let cart = new Cart({
    quantity,
    totalCost,
    product
  });
  let newCart = await cart.save();
  res.send(newCart);
});

router.get('/', async (req, res) => {
  let cart = await Cart.find().populate('product');
  res.send(cart);

});
router.put('/', async (req, res) => {
  let updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body);
  res.send(updatedCart);
});

router.delete('/:id', async (req, res) => {
  let deletedCart = await Cart.findByIdAndRemove(req.params.id, req.body);
  res.send(deletedCart);
});

module.exports = router;
