const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Use your existing database
const dbPath = path.resolve(__dirname, 'dissertation.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database at', dbPath);
  }
});

module.exports = db;
