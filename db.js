const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "mfa_db"
});

module.exports = db;