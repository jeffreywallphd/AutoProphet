require('dotenv').config({ path: './database.env' });
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MySQL Database Connection using Environment Variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('Connected to MySQL database');
});

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO users (firstName, middleName, lastName, email, password) VALUES (?, ?, ?, ?, ?)',
      [firstName, middleName, lastName, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
