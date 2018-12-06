const express = require('express');
const router = express.Router();
const Products = require('../models/productModel');
const {loggedIn} = require('../middlwares/authentication');
const {isAdmin} = require('../middlwares/authorization');

// get all products
router.get('/', async (req, res) => {
  res.send(await Products.find());
});

// get one product
router.get('/:id', async (req, res) => {
  const product = await Products.findById(req.params.id);
  if (!product) return res.status(404).send('Product not found');

  res.send(product);
});

// adding a new product
router.post('/', [loggedIn, isAdmin], async (req, res) => {
  const {error} = Products.productValidation(req.body);
  if (error) return res.status(400).send(error.message);

  const {
    name,
    price,
    discount,
    productInfo
  } = req.body;
  const product = new Products({
    name,
    price,
    discount,
    productInfo
  });

  const savedProduct = await product.save();
  res.send(savedProduct);
});

// update an existing product
router.put('/update', [loggedIn, isAdmin], async (req, res) => {
  const {id} = req.query;
  if (!await Products.findById(id)) return res.status(404).send('Product not found');

  await Products.updateOne({_id: id}, req.body);
  res.send(await Products.findById(id));
});

// delete an existing product if the account type is Premium or Enterprise
router.delete('/delete', [loggedIn, isAdmin], async (req, res) => {
  const {id} = req.query;
  const existingProducts = await Products.findById(id);
  if (!existingProducts) return res.status(404).send('User not found');

  existingProducts.remove();
  res.send('removed');
});

module.exports = router;
