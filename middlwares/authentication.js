const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = {
  loggedIn(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Not allowed, no token provided');

    try {
      req.user = jwt.verify(token, config.get('secretToken'));
      next();
    } catch (e) {
      res.status(401).send('Invalid token');
    }
  }
};
