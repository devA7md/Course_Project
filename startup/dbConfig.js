const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('app:db');

const opts = {
  useNewUrlParser: true,
  useCreateIndex: true
};

module.exports = () => {
  const db = config.get('db.URI');

  mongoose.connect(db, opts)
    .then(() => debug(`Connected to ${db}`))
    .catch((err) => debug(err.message))
};
