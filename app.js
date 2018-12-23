require('express-async-errors');

const express = require('express');
const app = express();

const config = require('config');
const logs = require('./logs');
const debugServer = require('debug')('app:server');
const unhandledErrors = require('debug')('app:unhandledErrors');

// listening...
const port = process.env.PORT || config.get('port');
const server = app.listen(port, debugServer(`listening to port ${port}...`));

// unhandled global errors
process.on('uncaughtException', (ex) => {
  logs.error(ex);
  unhandledErrors(ex);
});
process.on('unhandledRejection', (err) => {
  logs.error(err);
  unhandledErrors(err);
});

// configuration
require('./startup/dbConfig')();
require('./startup/middlewaresConfig')(app);
require('./startup/routesConfig')(app);
require('./startup/globalErrorConfig')(app);

// for tests purposes
module.exports = server;
