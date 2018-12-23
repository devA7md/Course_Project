const createError = require('http-errors');
const customerRouter = require('../routes/customerRouter');
const productRouter = require('../routes/productRouter');
const cartRouter = require('../routes/cartRouter');
const orderRouter = require('../routes/orderRouter');

module.exports = (app) => {
  app.use('/api/customers', customerRouter);
  app.use('/api/products', productRouter);
  app.use('/api/cart', cartRouter);
  app.use('/api/order', orderRouter);

  // handling non existing route
  app.use((req, res, next) => {
    next(createError(404));
  });
};
