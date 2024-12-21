const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/db');

const login = (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user)
      return res.status(401).send({ message: 'Invalid credentials' });

    // Check if the role is allowed to log in
    if (user.role === 'student') {
      return res
        .status(403)
        .send({ message: 'Students are not allowed to log in.' });
    }

    // Compare password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).send({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret', // Fallback for JWT secret
      { expiresIn: '1h' }
    );

    res.send({ token, role: user.role });
  });
};

module.exports = { login };
