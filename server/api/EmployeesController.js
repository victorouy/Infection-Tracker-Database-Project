var db = require("../db");

function getScheduleForEmployee(req, res) {
  const empId = req.params.employeeId;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  console.log(empId, startDate, endDate);

  // SQL query to select all persons
  //const query = "SELECT * FROM Schedules WHERE EmployeeID = ?";
  // const query = "SELECT * FROM Employees";
  const query = `SELECT Name, Date, StartTime, EndTime
  FROM Schedules, Facilities
  WHERE Schedules.FacilityID = Facilities.FacilityID AND EmployeeID = ? AND Date BETWEEN ? AND ?
  ORDER BY NAME ASC, Date ASC, StartTime ASC`;
  // Perform the query
  db.query(query, [empId, startDate, endDate], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    // If query is successful, send back the person
    res.json({ results });
  });
}

function getAllEmployees(req, res) {
  // SQL query to select all employees
  const query = `SELECT e.EmployeeID, e.PersonID, p.FirstName, p.LastName, e.Role, e.FacilityID, f.Name 
  FROM Employees e JOIN Persons p ON e.PersonID = p.PersonID 
  JOIN Facilities f on e.FacilityID = f.FacilityID`;

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ employees: results });
  });
}

function deleteEmployee(req, res) {
  const employeeId = req.params.employeeId;

  // SQL query to delete a Employee by EmployeeID
  const deleteFromEmployeesQuery = "DELETE FROM Employees WHERE EmployeeID = ?";
  const deleteFromEmployeePersonRelationshipQuery =
    "DELETE FROM EmployeePersonRelationship WHERE EmployeeID = ?";
  const deleteFromSchedulesQuery = "DELETE FROM Schedules WHERE EmployeeID = ?";
  const deleteFromEmploymentRecordQuery =
    "DELETE FROM EmploymentRecord WHERE EmployeeID = ?";

  // Perform the query
  db.query(
    deleteFromEmployeePersonRelationshipQuery,
    [employeeId],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if any rows were affected (indicating successful deletion)
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Person not found" });
      }
    }
  );

  db.query(deleteFromSchedulesQuery, [employeeId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Person not found" });
    }
  });
  // If deletion is successful, send back success message
  db.query(
    deleteFromEmploymentRecordQuery,
    [employeeId],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if any rows were affected (indicating successful deletion)
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Person not found" });
      }
    }
  );

  db.query(deleteFromEmployeesQuery, [employeeId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Person not found" });
    }

    res.json({ message: "Person deleted successfully" });
  });
}

module.exports = {
  getScheduleForEmployee,
  getAllEmployees,
  deleteEmployee,
};
