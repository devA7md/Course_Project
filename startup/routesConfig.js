const createError = require('http-errors');
const customerRouter = require('../routes/customerRouter');
const productRouter = require('../routes/productRouter');

module.exports = (app) => {
  app.use('/api/customers', customerRouter);
  app.use('/api/products', productRouter);

  // handling non existing route
  app.use((req, res, next) => {
    next(createError(404));
  });
};
