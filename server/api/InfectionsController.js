var db = require("../db");

function getAllInfections(req, res) {
  // SQL query to select all infections
  const query = "SELECT * FROM Infections";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ infections: results });
  });
}

function getInfection(req, res) {
  const infectionId = req.params.infectionId;

  // SQL query to select a specific Infection by InfectionID
  const query = "SELECT * FROM Infections WHERE InfectionID = ?";

  // Perform the query
  db.query(query, [infectionId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If query is successful, send back the infection
    res.json({ infection: results[0] });
  });
}

function createInfection(req, res) {
  const {
    PersonID,
    InfectionDate,
    InfectionEndDate,
    InfectionType,
  } = req.body;

  // SQL query to insert a new Infection into the DB
  const query = `
      INSERT INTO Infections (
        PersonID,
        InfectionDate,
        InfectionEndDate,
        InfectionType
      ) VALUES (?, ?, ?, ?)
    `;

  // Values to be inserted
  const values = [
    PersonID,
    InfectionDate,
    InfectionEndDate,
    InfectionType,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If insertion is successful, send back success message
    res.json({ message: "Infection created successfully" });
  });
}

function deleteInfection(req, res) {
  const infectionId = req.params.infectionId;

  // SQL query to delete an Infection by InfectionID
  const query = "DELETE FROM Infections WHERE InfectionID = ?";

  // Perform the query
  db.query(query, [infectionId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Infection deleted successfully" });
  });
}

function editInfection(req, res) {
  const infectionId = req.params.infectionId;
  const {
    PersonID,
    InfectionDate,
    InfectionEndDate,
    InfectionType,
  } = req.body;

  // SQL query to update an Infection by InfectionID
  const query = `
    UPDATE Infections
    SET PersonID = ?,
        InfectionDate = ?,
        InfectionEndDate = ?,
        InfectionType = ? 
    WHERE InfectionID = ?
  `;

  // Values to be updated
  const values = [
    PersonID,
    InfectionDate,
    InfectionEndDate,
    InfectionType,
    infectionId,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful update)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If update is successful, send back success message
    res.json({ message: "Infection updated successfully" });
  });
}

module.exports = {
  getAllInfections,
  getInfection,
  createInfection,
  deleteInfection,
  editInfection,
};
