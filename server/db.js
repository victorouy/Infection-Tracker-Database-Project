const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// MySQL Connection Configuration
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL database: " + err.stack);
    return;
  }
  console.log("Successfully connected to MySQL database");
});

module.exports = connection;
