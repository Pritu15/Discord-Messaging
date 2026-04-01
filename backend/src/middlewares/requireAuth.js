const { authenticateAccessToken } = require('./authenticate');

const PUBLIC_PATHS = ['/auth/login', '/auth/register', '/health'];

const requireAuth = async (req, res, next) => {
  const isPublicPath = PUBLIC_PATHS.some((path) => req.path.includes(path));

  if (isPublicPath) {
    return next();
  }

  return authenticateAccessToken(req, res, next);
};

module.exports = { requireAuth };
