const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  const id = req.params.id || req.query.id;
  mongoose.Types.ObjectId.isValid(id) ? next() : res.status(400).send('Invalid id');
};
