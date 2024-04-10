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

function getQuery8(req, res) {
  const query = `SELECT 
  f.Name AS FacilityName,
  f.Address,
  f.City,
  f.Province,
  f.PostalCode,
  f.PhoneNumber,
  f.WebAddress,
  f.Type AS FacilityType,
  f.Capacity,
  CONCAT(p.FirstName, ' ', p.LastName) AS GeneralManagerName,
  COUNT(DISTINCT e.EmployeeID) AS NumEmployees,
  SUM(CASE WHEN e.Role = 'Doctor' THEN 1 ELSE 0 END) AS NumDoctors,
  SUM(CASE WHEN e.Role = 'Nurse' THEN 1 ELSE 0 END) AS NumNurses
FROM 
  Facilities f
LEFT JOIN 
  Employees e ON f.FacilityID = e.FacilityID
LEFT JOIN 
  Persons p ON f.GeneralManagerID = p.PersonID
GROUP BY 
  f.FacilityID
ORDER BY 
  f.Province ASC,
  f.City ASC,
  f.Type ASC,
  NumDoctors ASC;
`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ results });
  });
}
function getQuery13(req, res){
  const facilityID = req.params.facilityID;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  const query = `
  Select E.*
  from Facilities AS F
  join Emails AS E on F.FacilityID =E.FacilityID
  where F.facilityID = ? and E.Date BETWEEN ? AND ?
  order by E.date
  `;
  db.query(query, [facilityID, startDate, endDate], (error, results, fields) => {
		if (error) {
			console.error("Error executing query: " + error.stack);
			return res.status(500).json({ error: "Internal Server Error" });
		}
		
		if (results.length == 0) {
			return res.status(404).json({ error: "getQuery 13 not found" });
		}
		
		res.json({ results });
	});
}
module.exports = {
  getAllFacilities,
  createFacilities,
  deleteFacilities,
  editFacilities,
  getQuery8,
  getQuery13,
};
