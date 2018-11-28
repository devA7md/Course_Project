const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:db');

const opts = {
  useNewUrlParser: true
};
module.exports = () => {
  mongoose.connect(config.get('db.URI'), opts)
    .then(() => debug('Connected to db...'))
    .catch((err) => debug(err.message))
};
