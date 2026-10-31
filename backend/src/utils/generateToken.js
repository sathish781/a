const jwt = require('jsonwebtoken');

function generateToken(userId, role) {
  return jwt.sign(
    {
      id: userId,
      role: role
    },
    process.env.JWT_SECRET || 'secret123',
    {
      expiresIn: '7d'
    }
  );
}

module.exports = generateToken;