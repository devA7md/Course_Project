const debug = require('debug')('app:error');
const logs = require('../logs');

module.exports = (app) => {
  app.use((err, req, res, next) => {
    logs.error(err);

    const status = err['status'] || 500;
    debug(status, err['message']);

    res.status(status).send(err['message']);
  });
};