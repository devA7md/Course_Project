require('express-async-errors');
const express = require('express');
const app = express();
const config = require('config');
const debug = require('debug')('app:server');

const port = process.env.PORT || config.get('port');
app.listen(port, debug(`listening to port ${port}...`));

require('./startup/db')();
require('./startup/middlewares')(app);
require('./startup/routes')(app);
require('./startup/error')(app);
