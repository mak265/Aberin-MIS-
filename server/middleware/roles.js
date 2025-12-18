const User = require('../models/User');

module.exports = function allowed(...roles) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ message: 'Unauthorized' });
      const user = await User.findById(req.user.id);
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      if (!roles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
}
