const express = require('express');
const router = express.Router();

const Product = require('../models/productModel');
const Customer = require('../models/customerModel');

const {loggedIn} = require('../middlwares/authentication');
const {isAdmin} = require('../middlwares/authorization');
const idValidation = require('../middlwares/idValidation');

// get all products
router.get('/', async (req, res) => {
  const allProducts = await Product.find()
    .populate({
      path: 'customer',
      select: 'username -_id'
    });
  res.send(allProducts);
});

// get one product
router.get('/:id', idValidation, async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({
      path: 'customer',
      select: 'username -_id'
    });
  if (!product) return res.status(404).send('Product not found');

  res.send(product);
});

// adding a new product if the user is admin
router.post('/', [loggedIn, isAdmin], async (req, res) => {
  const {error} = Product.productValidation(req.body);
  if (error) return res.status(400).send(error.message);

  const {
    name,
    price,
    discount,
    productInfo
  } = req.body;
  const product = new Product({
    name,
    price,
    discount,
    productInfo
  });

  const id = req.user.id;
  await Customer.updateOne({_id: id}, {$push: {products: product._id}});
  product.set('customer', id);

  const savedProduct = await product.save();
  res.send(savedProduct);
});

// update an existing product if logged in and the user is admin
router.put('/update', [loggedIn, isAdmin, idValidation], async (req, res) => {
  const {id} = req.query;
  if (!await Product.findById(id)) return res.status(404).send('Product not found');

  const updatedProduct = await Product.findOneAndUpdate({_id: id}, req.body, {new: true});
  res.send(updatedProduct);
});

// delete an existing product if logged in and the user is admin
router.delete('/delete', [loggedIn, isAdmin, idValidation], async (req, res) => {
  const {id} = req.query;
  const existingProducts = await Product.findById(id);
  if (!existingProducts) return res.status(404).send('User not found');

  existingProducts.remove();
  res.send('removed');
});

module.exports = router;
