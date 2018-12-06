const createError = require('http-errors');
const customerRouter = require('../routes/customerRoute');

module.exports = (app) => {
  app.use('/api/customers', customerRouter);

  // handling non existing route
  app.use((req, res, next) => {
    next(createError(404));
  });
};
