var db = require("../db");


function getAllPersons(req, res) {
  // SQL query to select all persons
  const query = "SELECT * FROM Employees";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ persons: results });
  });
}
