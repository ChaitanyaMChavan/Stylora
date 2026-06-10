const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next({
        statusCode: 401,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return next({
        statusCode: 403,
        message: "Forbidden",
      });
    }

    next();
  };
};

module.exports = {
  authorize,
};