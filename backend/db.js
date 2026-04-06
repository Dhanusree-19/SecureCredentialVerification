// db.js — MySQL Connection
// This file creates one shared database connection used across all route files.
//
// HOW TO SET UP:
// 1. Install MySQL on your computer: https://dev.mysql.com/downloads/mysql/
// 2. Open MySQL and run the SQL from the file: database.sql
// 3. Fill in your MySQL username and password below

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",       // usually localhost
  user: "root",           // ← your MySQL username (usually root)
  password: "1234",           // ← your MySQL password
  database: "faculty_db", // ← the database name (created by database.sql)
});

db.connect((err) => {
  if (err) {
    console.log(" MySQL connection failed:", err.message);
    console.log("   → Check your MySQL username/password in backend/db.js");
    process.exit(1); // stop the server if DB fails — no point running without DB
  }
  console.log("Connected to MySQL database (faculty_db)");
});

module.exports = db;
