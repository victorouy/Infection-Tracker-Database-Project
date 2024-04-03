var db = require("../db");

function getAllPersons(req, res) {
  // SQL query to select all persons
  const query = "SELECT * FROM Persons";

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

function getPerson(req, res) {
  const personId = req.params.personId;

  // SQL query to select a specific Person by PersonId
  const query = "SELECT * FROM Persons WHERE PersonID = ?";

  // Perform the query
  db.query(query, [personId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    // If query is successful, send back the person
    res.json({ person: results[0] });
  });
}

function createPerson(req, res) {
  const {
    FirstName,
    LastName,
    DateOfBirth,
    SocialSecurityNumber,
    MedicareCardNumber,
    TelephoneNumber,
    Citizenship,
    EmailAddress,
  } = req.body;

  // SQL query to insert a new Person into the DB
  const query = `
      INSERT INTO Persons (
        FirstName,
        LastName,
        DateOfBirth,
        SocialSecurityNumber,
        MedicareCardNumber,
        TelephoneNumber,
        Citizenship,
        EmailAddress
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

  // Values to be inserted
  const values = [
    FirstName,
    LastName,
    DateOfBirth,
    SocialSecurityNumber,
    MedicareCardNumber,
    TelephoneNumber,
    Citizenship,
    EmailAddress,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If insertion is successful, send back success message
    res.json({ message: "Person created successfully" });
  });
}

function deletePerson(req, res) {
  const personId = req.params.personId;

  // SQL query to delete a Person by PersonId
  const query = "DELETE FROM Persons WHERE PersonID = ?";

  // Perform the query
  db.query(query, [personId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Person deleted successfully" });
  });
}

function editPerson(req, res) {
  const personId = req.params.personId;
  const {
    FirstName,
    LastName,
    DateOfBirth,
    SocialSecurityNumber,
    MedicareCardNumber,
    TelephoneNumber,
    Citizenship,
    EmailAddress,
  } = req.body;

  // SQL query to update a Person by PersonId
  const query = `
    UPDATE Persons
    SET FirstName = ?,
        LastName = ?,
        DateOfBirth = ?,
        SocialSecurityNumber = ?,
        MedicareCardNumber = ?,
        TelephoneNumber = ?,
        Citizenship = ?,
        EmailAddress = ?
    WHERE PersonID = ?
  `;

  // Values to be updated
  const values = [
    FirstName,
    LastName,
    DateOfBirth,
    SocialSecurityNumber,
    MedicareCardNumber,
    TelephoneNumber,
    Citizenship,
    EmailAddress,
    personId,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful update)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    // If update is successful, send back success message
    res.json({ message: "Person updated successfully" });
  });
}

module.exports = {
  getAllPersons,
  getPerson,
  createPerson,
  deletePerson,
  editPerson,
};
