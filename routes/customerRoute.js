const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const authentication = require('../middlwares/authentication');
const authorization = require('../middlwares/authorization');

// get all customers
router.get('/', authentication, async (req, res) => {
  res.send(await Customer.find());
});

// get one customer
router.get('/:id', authentication, async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('User not found');

  res.send(customer);
});

// signing up for a new customer
router.post('/signup', async (req, res) => {
  const {error} = Customer.signupValidation(req.body);
  if (error) return res.status(400).send(error.message);

  const {username, email} = req.body;
  const existingCustomer = await Customer.findOne({username, email});
  if (existingCustomer) return res.status(400).send('Customer already exist');

  const {
    name,
    phone,
    password,
    accountType,
    address
  } = req.body;
  const customer = new Customer({
    name,
    username,
    email,
    phone,
    password,
    accountType,
    address
  });

  await customer.save();

  const token = customer.generateToken();
  res.header('x-auth-token', token);
  res.send(token);
});

// signing in a customer
router.post('/signin', async (req, res) => {
  const {error} = Customer.loginValidation(req.body);
  if (error) return res.status(401).send(error.message);

  const {username, password} = req.body;

  const customer = await Customer.findOne({username});
  if (!customer) return res.status(404).send('Invalid username or password');

  const result = await customer.comparePassword(password);
  if (!result) return res.status(404).send('Invalid username or password');

  const token = customer.generateToken();
  res.header('x-auth-token', token);
  res.send(token);
});

// update an existing customer if the account type is Premium or Enterprise
router.put('/update', [authentication, authorization], async (req, res) => {
  const {id} = req.user;
  const existingCustomer = await Customer.findById(id);
  if (!existingCustomer) return res.status(404).send('User not found');

  await Customer.updateOne({_id: id}, req.body);
  res.send(await Customer.findById(id));
});

// delete an existing customer if the account type is Premium or Enterprise
router.delete('/delete', [authentication, authorization], async (req, res) => {
  const {id} = req.user;
  const existingCustomer = await Customer.findById(id);
  if (!existingCustomer) return res.status(404).send('User not found');

  existingCustomer.remove();
  res.send('removed');
});

module.exports = router;
