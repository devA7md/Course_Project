const createError = require('http-errors');
const debug = require('debug')('app:error');

module.exports = (app) => {
  // handling non existing route
  app.use((req, res, next) => {
    next(createError(404));
  });
  // catch global errors
  app.use((err, req, res, next) => {
    // TODO check incoming status
    res.status(err['status']).send(err['message']);
  });
};