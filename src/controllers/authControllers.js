const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/database')
require('dotenv').config()

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);

    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      name || '',
      email,
      hashedPassword,
      role || 'attendee'
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('REGISTER ERROR 👉', err);   // 👈 IMPORTANT
    res.status(500).json({ message: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  const user = db.prepare(`SELECT * FROM users WHERE email=?`).get(email)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};