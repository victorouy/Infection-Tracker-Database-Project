var db = require("../db");

function getAllResidence(req, res) {
  // SQL query to select all Residence
  const query = "SELECT * FROM Residence";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ Residence: results });
  });
}

function getResidence(req, res) {
  const ResidenceID = req.params.residenceId;

  // SQL query to select a specific Residence by ResidenceID
  const query = "SELECT * FROM Residence WHERE ResidenceID = ?";

  // Perform the query
  db.query(query, [ResidenceID], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Residence not found" });
    }

    // If query is successful, send back the Residence
    res.json({ residence: results[0] });
  });
}

function createResidence(req, res) {
  const {
    residenceId,
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumbeOfBedrooms,
  } = req.body;

  // SQL query to insert a new Residence into the DB
  const query = `
      INSERT INTO Residence (
        residenceId,
        Type,
        Address,
        City,
        Province,
        PostalCode,
        PhoneNumber,
        NumbeOfBedrooms,
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  // Values to be inserted
  const values = [
    residenceId,
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumbeOfBedrooms,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If insertion is successful, send back success message
    res.json({ message: "Residence created successfully" });
  });
}

function deleteResidence(req, res) {
  const ResidenceId = req.params.residenceId;

  // SQL query to delete a Residence by ResidenceId
  const query = "DELETE FROM Residence WHERE ResidenceID = ?";

  // Perform the query
  db.query(query, [ResidenceId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Residence not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Residence deleted successfully" });
  });
}

function editResidence(req, res) {
  const ResidenceId = req.params.residenceId;
  const {
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumbeOfBedrooms,
  } = req.body;

  // SQL query to update a Residence by ResidenceId
  const query = `
    UPDATE Residence
    SET Type = ?,
        Address = ?,
        City = ?,
        Province = ?,
        PostalCode = ?,
        PhoneNumber = ?,
        NumbeOfBedrooms = ?,
    WHERE residenceId = ?
  `;

  // Values to be updated
  const values = [
    
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumbeOfBedrooms,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful update)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Residence not found" });
    }

    // If update is successful, send back success message
    res.json({ message: "Residence updated successfully" });
  });
}

module.exports = {
  getAllResidence,
  getResidence,
  createResidence,
  deleteResidence,
  editResidence,
};
