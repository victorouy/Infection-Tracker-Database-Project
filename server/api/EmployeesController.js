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

module.exports = {
  getScheduleForEmployee,
};
