const fs = require('fs');
const winston = require('winston');

winston.configure({
  transports: [
    new winston.transports.File({
      filename: './logging/winston/winstonError.txt',
      level: 'error'
    })
  ]
});

module.exports = {
  error(msg) {
    const loggedMsg = {
      error: msg.message,
      timestamp: new Date().toLocaleString()
    };
    fs.appendFile('./logging/error.txt', JSON.stringify(loggedMsg) + '\n', function (err) {
      if (err) winston.error(err);
    });
  }
};
