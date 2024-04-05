var db = require("../db");

function getAllFacilities(req, res) {
  // SQL query to select all Facilities
  const query = "SELECT * FROM Facilities";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ facilities: results });
  });
}

function getFacilities(req, res) {
  const FacilityID = req.params.FacilityID;

  // SQL query to select a specific Facilities by FacilityID
  const query = "SELECT * FROM Facilities WHERE FacilityID = ?";

  // Perform the query
  db.query(query, [FacilityID], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Facilities not found" });
    }

    // If query is successful, send back the Facilities
    res.json({ facilities: results[0] });
  });
}

function createFacilities(req, res) {
  const {
    Name,    
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    WebAddress,
    Type,
    Capacity,
    GeneralManagerID,
  } = req.body;

  // SQL query to insert a new Facilities into the DB
  const query = `
      INSERT INTO Facilities (
          Name,    
          Address,
          City,
          Province,
          PostalCode,
          PhoneNumber,
          WebAddress,
          Type,
          Capacity,
          GeneralManagerID
      ) VALUES (?,?,?,?,?,?,?,?,?,?);
    `;

  // Values to be inserted
  const values = [
    Name,    
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    WebAddress,
    Type,
    Capacity,
    GeneralManagerID,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If insertion is successful, send back success message
    res.json({ message: "facilities created successfully" });
  });
}

function deleteFacilities(req, res) {
  const FacilityID = req.params.FacilityID;

  // SQL query to delete a Facilities by FacilityID
  const query = "DELETE FROM Facilities WHERE FacilityID = ?";

  // Perform the query
  db.query(query, [FacilityID], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Facilities not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Facilities deleted successfully" });
  });
}

function editFacilities(req, res) {
  const FacilityID = req.params.FacilityID;
  const {
    Name,    
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    WebAddress,
    Type,
    Capacity,
    GeneralManagerID,
  } = req.body;

  // SQL query to update a Facilities by FacilityID
  const query = `
    UPDATE Facilities
    SET 
    Name = ?,  
    Address = ?,
    City = ?,
    Province = ?,
    PostalCode = ?,
    PhoneNumber = ?,
    WebAddress = ?,
    Type = ?,
    Capacity = ?,
    GeneralManagerID = ?
    WHERE FacilityID = ?
  `;

  // Values to be updated
  const values = [
    Name,    
    Address,
    City,
    Province,
    PostalCode,
    PhoneNumber,
    WebAddress,
    Type,
    Capacity,
    GeneralManagerID,
    FacilityID,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful update)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Facilities not found" });
    }

    // If update is successful, send back success message
    res.json({ message: "Facilities updated successfully" });
  });
}

module.exports = {
  getAllFacilities,
  getFacilities,
  createFacilities,
  deleteFacilities,
  editFacilities,
};
