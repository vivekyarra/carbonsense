/**
 * @file Database configuration and initialization using better-sqlite3.
 */

const Database = require('better-sqlite3');
const path = require('path');
const logger = require('../utils/logger');
const fs = require('fs');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, '../../data/carbonsense.db');
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Open the database connection
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'development' ? logger.debug : null });

// Enable WAL mode for better concurrency and performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

/**
 * Initializes the database tables and indexes if they don't exist.
 */
function initDB() {
  try {
    const initScript = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        daily_target_kg REAL DEFAULT 10.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        category TEXT NOT NULL CHECK(category IN ('transportation', 'food', 'energy')),
        subcategory TEXT NOT NULL,
        quantity REAL NOT NULL CHECK(quantity > 0),
        unit TEXT NOT NULL,
        co2_kg REAL NOT NULL,
        activity_date DATE NOT NULL,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS tips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        potential_saving_kg REAL NOT NULL,
        difficulty TEXT CHECK(difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium'
      );

      CREATE TABLE IF NOT EXISTS user_saved_tips (
        user_id INTEGER NOT NULL,
        tip_id INTEGER NOT NULL,
        saved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, tip_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (tip_id) REFERENCES tips(id) ON DELETE CASCADE
      );

      CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
      CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(activity_date);
      CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);
      CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, activity_date);
    `;

    db.exec(initScript);
    logger.info('Database tables and indexes initialized correctly.');
  } catch (error) {
    logger.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Always run initDB to ensure tables exist
initDB();

module.exports = db;
