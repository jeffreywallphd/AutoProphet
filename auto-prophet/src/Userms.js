const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const path = require('path');

const userms = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'Asset', 'DB', 'AutoProphet.db');

// Middleware
userms.use(bodyParser.json());

// SQLite Database Connection
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    setupDatabase();
  }
});

function setupDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      middleName TEXT,
      lastName TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      lastLoggedIn TIMESTAMP NULL,
      isLoggedIn BOOLEAN DEFAULT FALSE,
      isValid BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table is ready');
    }
  });
}

// Signup Route
userms.post('/signup', async (req, res) => {
  const { firstName, middleName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (row) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (firstName, middleName, lastName, email, password, lastLoggedIn, isLoggedIn, isValid)
      VALUES (?, ?, ?, ?, ?, NULL, FALSE, FALSE)
    `;

    db.run(insertQuery, [firstName, middleName, lastName, email, hashedPassword], function (err) {
      if (err) {
        console.error('Error saving user:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(201).json({ message: 'User registered successfully, pending validation' });
    });
  });
});

// Login Route
userms.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const updateQuery = `UPDATE users SET isLoggedIn = TRUE, lastLoggedIn = datetime('now') WHERE id = ?`;
    db.run(updateQuery, [user.id], (err) => {
      if (err) {
        console.error('Error updating login status:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(200).json({ message: 'Login successful', user });
    });
  });
});

// Check Email Exists Route
userms.get('/check-email', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ exists: false });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ exists: false });
    }
    res.status(200).json({ exists: !!row });
  });
});

// Reset Password Route
userms.put('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const updateQuery = 'UPDATE users SET password = ? WHERE email = ?';

  db.run(updateQuery, [hashedPassword, email], function (err) {
    if (err) {
      console.error('Error updating password:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Password reset successfully' });
  });
});

// Logout Route
userms.put('/logout', (req, res) => {
  const { userId } = req.body;

  const updateQuery = 'UPDATE users SET isLoggedIn = FALSE WHERE id = ?';
  db.run(updateQuery, [userId], (err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

module.exports = userms;