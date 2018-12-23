const express = require('express');
const router = express.Router();

const Order = require('../models/orderModel');

const {loggedIn} = require('../middlwares/authentication');

router.get('/', [loggedIn], async (req, res) => {
  const order = await Order.find()
    .populate({
      path: 'products customer'
    });
  res.send(order);
});

router.post('/', loggedIn, async (req, res) => {
  const {status, shipmentInfo} = req.body,
    {id} = req.user;

  const order = new Order({
    status,
    shipmentInfo,
    customer: id
  });
  const newOrder = await order.save();

  res.send(newOrder);
});

router.put('/:id', loggedIn, async (req, res) => {
  const {id} = req.params;
  await Order.updateOne({_id: id}, req.body);

  const UpdatedOrder = await Order.findById(id);
  res.send(UpdatedOrder);
});

router.delete('/:id', loggedIn, async (req, res) => {
  const deletedOrder = await Order.findByIdAndRemove(req.params.id);
  res.send(deletedOrder);
});

module.exports = router;
