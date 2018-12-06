module.exports = {
  isPremium(req, res, next) {
    if (req.user.type === 'Standard')
      return res.status(403).send('Update account to Premium to do this process');
    next();
  },
  isAdmin(req, res, next) {
    if (!req.user.admin)
      return res.status(403).send('You do not have permission to do this');
    next();
  }
};
