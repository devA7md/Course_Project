const debug = require('debug')('app:error');

module.exports = (app) => {
  app.use((err, req, res, next) => {
    const status = err['status'] || 500;
    debug(status, err['message']);
    res.status(status).send(err['message']);
  });
};