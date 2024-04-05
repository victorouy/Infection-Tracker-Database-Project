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
    res.json({ residence: results });
  });
}

function getResidence(req, res) {
  const ResidenceID = req.params.ResidenceID;

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
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumberOfBedrooms,
  } = req.body;

  // SQL query to insert a new Residence into the DB
  const query = `
  INSERT INTO Residence (
    Type,Address,City,Province,PostalCode,PhoneNumber,NumberOfBedrooms) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

  // Values to be inserted
  const values = [
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumberOfBedrooms,
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
  const ResidenceID = req.params.ResidenceID;

  // SQL query to delete a Residence by ResidenceID
  const query = "DELETE FROM Residence WHERE ResidenceID = ?";

  // Perform the query
  db.query(query, [ResidenceID], (error, results, fields) => {
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
  const ResidenceID = req.params.ResidenceID;
  const {
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumberOfBedrooms,
  } = req.body;

  // SQL query to update a Residence by ResidenceID
  const query = `
    UPDATE Residence
    SET Type = ?,
        Address = ?,
        City = ?,
        Province = ?,
        PostalCode = ?,
        PhoneNumber = ?,
        NumberOfBedrooms = ?
    WHERE ResidenceID = ?
  `;

  // Values to be updated
  const values = [
    
    Type,
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    NumberOfBedrooms,
    ResidenceID,
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
