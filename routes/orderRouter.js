const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

router.post('/', async (req, res) => {
  const {orderNumber, status, shipmentInfo, discount, totalCost} = req.body;
  const order = new Order({
    orderNumber,
    status,
    shipmentInfo,
    discount,
    totalCost
  });
  const newOrder = await order.save();

  res.send(newOrder);
});

router.get('/', async (req, res) => {
  const order = await Order.find();
  res.send(order)
});

router.put('/:id', async (req, res) => {
  const {id} = req.params;
  await Order.updateOne({_id: id}, req.body);

  const UpdatedOrder = await Order.findById(id);
  res.send(UpdatedOrder);
});

router.delete('/:id', async (req, res) => {
  const deconstedOrder = await Order.findByIdAndRemove(req.params.id);
  res.send(deconstedOrder);
});

module.exports = router;
