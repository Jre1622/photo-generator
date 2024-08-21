const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database", err);
  } else {
    console.log("Connected to the SQLite database.");
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Users table
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
      (err) => {
        if (err) {
          console.error("Error creating users table", err);
        } else {
          console.log("Users table created or already exists.");
        }
      }
    );

    // Sessions table
    db.run(
      `CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      session_id TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
      (err) => {
        if (err) {
          console.error("Error creating sessions table", err);
        } else {
          console.log("Sessions table created or already exists.");
        }
      }
    );
  });
}

module.exports = db;
