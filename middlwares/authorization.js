module.exports = (req, res, next) => {
  if (req.user.type === 'Standard')
    return res.status(401).send('Update account to Premium to do this process');
  next();
};
