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
  port: process.env.DB_PORT,
});

function setupDatabase() {
  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
  
  // Create the database if it doesn't exist
  db.query(createDatabaseQuery, (err) => {
    if (err) {
      console.error('Error creating database:', err.message);
      return;
    }
    console.log(`Database ${process.env.DB_NAME} is ready`);

    // Switch to the created database
    db.changeUser({ database: process.env.DB_NAME }, (err) => {
      if (err) {
        console.error('Error switching to database:', err.message);
        return;
      }
      console.log(`Switched to database ${process.env.DB_NAME}`);

      // Create the users table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          firstName VARCHAR(50) NOT NULL,
          middleName VARCHAR(50),
          lastName VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          lastLoggedIn TIMESTAMP NULL,
          isLoggedIn BOOLEAN DEFAULT FALSE,
          isValid BOOLEAN DEFAULT FALSE,
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
}

// Attempt to connect to MySQL server
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err.message);
  } else {
    console.log('Connected to MySQL server');
    setupDatabase();
  }
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
      'INSERT INTO users (firstName, middleName, lastName, email, password, lastLoggedIn, isLoggedIn, isValid) VALUES (?, ?, ?, ?, ?, NULL, FALSE, FALSE)',
      [firstName, middleName, lastName, email, hashedPassword],
      (err, results) => {
        if (err) {
          console.error('Error saving user:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        res.status(201).json({ message: 'User registered successfully, pending validation' });
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

    // Update isLoggedIn and lastLoggedIn
    db.query(
      'UPDATE users SET isLoggedIn = TRUE, lastLoggedIn = NOW() WHERE id = ?',
      [user.id],
      (err) => {
        if (err) {
          console.error('Error updating login status:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        res.status(200).json({ message: 'Login successful', user });
      }
    );
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
    res.status(200).json({ exists: results.length > 0 });
  });
});

// Reset Password Route
app.post('/api/reset-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

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

// Logout Route
app.post('/api/logout', (req, res) => {
  const { userId } = req.body;

  db.query('UPDATE users SET isLoggedIn = FALSE WHERE id = ?', [userId], (err) => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});