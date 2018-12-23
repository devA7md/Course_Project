const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');
const {loggedIn} = require('../middlwares/authentication');
const {isPremium} = require('../middlwares/authorization');

// get all customers
router.get('/', loggedIn, async (req, res) => {
  res.send(await Customer.find())
    .populate({
      path: 'products',
      select: 'name -_id'
    });
});

// get one customer
router.get('/:id', loggedIn, async (req, res) => {
  const customer = await Customer.findById(req.params.id)
    .populate({
      path: 'products',
      select: 'name -_id'
    });
  if (!customer) return res.status(404).send('User not found');
  res.send(customer);
});

// signing up for a new customer
router.post('/signup', async (req, res) => {
  const {error} = Customer.signupValidation(req.body);
  if (error) return res.status(400).send(error.message);

  const {username, email} = req.body;
  const existingCustomer = await Customer.findOne({username, email});
  if (existingCustomer) return res.status(400).send('User already exist');

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
  res.send({token});
});

// signing in a customer
router.post('/signin', async (req, res) => {
  const {error} = Customer.loginValidation(req.body);
  if (error) return res.status(400).send(error.message);

  const {username, password} = req.body;

  const customer = await Customer.findOne({username});
  if (!customer) return res.status(404).send('Invalid username or password');

  const result = await customer.comparePassword(password);
  if (!result) return res.status(404).send('Invalid username or password');

  const token = customer.generateToken();
  res.header('x-auth-token', token);
  res.send({token});
});

// update an existing customer if the account type is Premium or Enterprise
router.put('/update', loggedIn, async (req, res) => {
  const {id} = req.user;
  if (!await Customer.findById(id)) return res.status(404).send('User not found');

  await Customer.updateOne({_id: id}, req.body);
  res.send(await Customer.findById(id));
});

// delete an existing customer if the account type is Premium or Enterprise
router.delete('/delete', [loggedIn, isPremium], async (req, res) => {
  const {id} = req.user;
  const existingCustomer = await Customer.findById(id);
  if (!existingCustomer) return res.status(404).send('User not found');

  await existingCustomer.remove();
  res.send({message: 'deleted'});
});

module.exports = router;
