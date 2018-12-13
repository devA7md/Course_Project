const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');

router.post('/', async (req, res) => {
  const {quantity, totalCost, product} = req.body;
  const cart = new Cart({
    quantity,
    totalCost,
    product
  });
  const newCart = await cart.save();
  res.send(newCart);
});

router.get('/', async (req, res) => {
  const cart = await Cart.find().populate('product');
  res.send(cart);

});
router.put('/', async (req, res) => {
  const updatedCart = await Cart.findByIdAndUpdate(req.params.id, req.body);
  res.send(updatedCart);
});

router.delete('/:id', async (req, res) => {
  let deletedCart = await Cart.findByIdAndRemove(req.params.id, req.body);
  res.send(deletedCart);
});

module.exports = router;
