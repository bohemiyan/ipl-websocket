const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
  const token= req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  
    // Verify token
    const decoded = jwt.verify(token, 'your_secret_key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
