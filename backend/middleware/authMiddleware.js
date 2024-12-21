const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send({ message: 'Unauthorized' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send({ message: 'Forbidden' });
    req.user = user; // Set the authenticated user
    next();
  });
}

// Middleware to authorize role
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    console.error(`Expected roles: ${roles}, User role: ${req.user.role}`);
    return res.status(403).send({ message: 'Forbidden' });
  }
  next();
};

// Export both functions
module.exports = {
  authenticateToken,
  authorizeRoles,
};
