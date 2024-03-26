// Import required modules
const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Create express app
const app = express();

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

// Define a route to perform a query
app.get("/", (req, res) => {
  // Sample query
  const query = "SELECT * FROM Persons";

  // Perform the query
  connection.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ results });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
