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

  // Create or use existing database
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      return;
    }
    console.log(`Database ${process.env.DB_NAME} is ready`);

    // Switch to the specified database
    db.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        console.error('Error switching database:', err.message);
        return;
      }
      console.log(`Switched to database ${process.env.DB_NAME}`);

      // Create users table if it doesn't exist
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstName VARCHAR(50) NOT NULL,
          middleName VARCHAR(50),
          lastName VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
      db.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating users table:', err.message);
          return;
        }
        console.log('Users table is ready');
      });
    });
  });
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

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;
    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // No token is generated or sent back
    res.status(200).json({ message: 'Login successful', user });
  });
});

// Check Email Exists Route
app.post('/api/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ exists: false });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      return res.status(200).json({ exists: true });
    }
    res.status(200).json({ exists: false });
  });
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email], (err, results) => {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Password reset successfully' });
  });
});

// Logout Route (Invalidate Token)
// NOTE: This is a simplistic implementation. Token invalidation should be handled via a more secure mechanism (e.g., blacklisting).
app.post('/api/logout', (req, res) => {
  // For this basic implementation, just send a response
  res.status(200).json({ message: 'Logout successful' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});