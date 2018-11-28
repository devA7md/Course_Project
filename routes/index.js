const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
  res.send('Something to send');
});

module.exports = route;
