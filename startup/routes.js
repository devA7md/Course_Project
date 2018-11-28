const indexRouter = require('../routes');

module.exports = (app) => {
  app.use('/', indexRouter);
};
