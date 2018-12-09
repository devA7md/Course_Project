const createError = require('http-errors');
const customerRouter = require('../routes/customerRouter');
const productRouter = require('../routes/productRouter');
const orderRouter=require('../routes/orderRouter');
const cartRouter=require('../routes/cartRouter');
module.exports = (app) => {
  app.use('/api/customers', customerRouter);
  app.use('/api/products', productRouter);
  app.use('/api/orders',orderRouter);
  app.use('/api/carts',cartRouter)

  // handling non existing route
  app.use((req, res, next) => {
    next(createError(404));
  });
};
