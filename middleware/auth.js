const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']; // Directly get the token from the header
  const secretKey = process.env.JWT_SECRET || 'abcde'; // Use the environment variable or a default

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.error('Verification Error:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    req.user = user; // Attach user to the request
    next(); // Proceed to the next middleware
  });
};

module.exports = authenticateToken;
