var db = require("../db");

function getAllVaccinations(req, res) {
  // SQL query to select all vaccinations
  const query = "SELECT * FROM Vaccines";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ vaccinations: results });
  });
}

function getVaccination(req, res) {
    const vaccineId = req.params.vaccineId;
  
    // SQL query to select a specific Vaccination by VaccineID
    const query = "SELECT * FROM Vaccines WHERE VaccineID = ?";
  
    // Perform the query
    db.query(query, [vaccineId], (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if any rows were returned
      if (results.length === 0) {
        return res.status(404).json({ error: "Vaccine not found" });
      }
  
      // If query is successful, send back the person
      res.json({ vaccinations: results[0] });
    });
}

function createVaccination(req, res) {
    const {
        PersonID,
        FacilityID,
        VaccinationType,
        VaccinationDate,
        DoseNumber,
    } = req.body;
  
    // SQL query to insert a new Person into the DB
    const query = `
        INSERT INTO Vaccines (
          PersonID,
          FacilityID,
          VaccinationType,
          VaccinationDate,
          DoseNumber
        ) VALUES (?, ?, ?, ?, ?)
      `;
  
    // Values to be inserted
    const values = [
      PersonID,
      FacilityID,
      VaccinationType,
      VaccinationDate,
      DoseNumber,
    ];
  
    // Perform the query
    db.query(query, values, (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // If insertion is successful, send back success message
      res.json({ message: "Vaccination created successfully" });
    });
  }
  
function deleteVaccination(req, res) {
    const vaccineId = req.params.vaccineId;
  
    // SQL query to delete a Person by PersonId
    const query = "DELETE FROM Vaccines WHERE VaccineID = ?";
  
    // Perform the query
    db.query(query, [vaccineId], (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      // Check if any rows were affected (indicating successful deletion)
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Vaccine not found" });
      }
  
      // If deletion is successful, send back success message
      res.json({ message: "Vaccine deleted successfully" });
    });
}

function editVaccination(req, res) {
  const vaccineId = req.params.vaccineId;
  const {
    PersonID,
    FacilityID,
    VaccinationType,
    VaccinationDate,
    DoseNumber,
  } = req.body;

  const query = `
    UPDATE Vaccines
    SET PersonID = ?,
        FacilityID = ?,
        VaccinationType = ?,
        VaccinationDate = ?,
        DoseNumber = ?
    WHERE VaccineID = ?
  `;

  const values = [
    PersonID,
    FacilityID,
    VaccinationType,
    VaccinationDate,
    DoseNumber,
    vaccineId,
  ];

  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Vaccine not found" });
    }

    res.json({ message: "Vaccine updated successfully" });
  });
}

module.exports = {
    getAllVaccinations,
    getVaccination,
    createVaccination,
    deleteVaccination,
    editVaccination
  };
  