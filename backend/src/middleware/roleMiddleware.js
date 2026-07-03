function allowRoles(...roles) {
  return function (req, res, next) {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('Access denied. You do not have permission.');
    }

    next();
  };
}

module.exports = allowRoles;