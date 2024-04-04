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

function getQuery16(req, res) {
  const query = `
  SELECT 
    E.Role,
    COUNT(DISTINCT E.EmployeeID) AS TotalEmployees,
    COUNT(DISTINCT CASE 
        WHEN I.InfectionType = 'COVID-19' AND I.InfectionEndDate IS NULL 
        THEN P.PersonID 
    END) AS TotalInfectedByCovid
  FROM Employees E
  JOIN Persons P ON E.PersonID = P.PersonID
  JOIN EmploymentRecord ER ON E.EmployeeID = ER.EmployeeID AND ER.EndDate IS NULL
  LEFT JOIN 
    (SELECT DISTINCT PersonID, InfectionType, InfectionEndDate
     FROM Infections 
     WHERE InfectionType = 'COVID-19' AND InfectionEndDate IS NULL) I 
    ON P.PersonID = I.PersonID
  GROUP BY E.Role
  ORDER BY E.Role ASC`;

  db.query(query, [], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(200).json({ error: "Employee not found" });
    }

    // If query is successful, send back the person
    res.json({ results });
  });
}

function getQuery17(req, res) {
  const query = `
  SELECT 
    E.Role,
    COUNT(DISTINCT E.EmployeeID) AS TotalEmployees,
    COUNT(DISTINCT CASE 
        WHEN NOT EXISTS (
            SELECT I.PersonID FROM Infections I 
            WHERE I.PersonID = P.PersonID
        ) THEN E.EmployeeID 
    END) AS TotalNeverInfected
  FROM Employees E
  JOIN Persons P ON E.PersonID = P.PersonID
  JOIN EmploymentRecord ER ON E.EmployeeID = ER.EmployeeID AND ER.EndDate IS NULL
  GROUP BY E.Role
  ORDER BY E.Role ASC`;

  db.query(query, [], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(200).json({ error: "Employee not found" });
    }

    // If query is successful, send back the person
    res.json({ results });
  });
}

function getQuery18(req, res) {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  const query = `
  SELECT 
    F.Province,
    COUNT(DISTINCT F.FacilityID) AS TotalFacilities,
    COUNT(DISTINCT ER.EmployeeID) AS TotalCurrentlyWorking,
    COUNT(DISTINCT CASE WHEN I.InfectionType = 'COVID-19' AND I.InfectionEndDate IS NULL THEN ER.EmployeeID END) AS TotalInfectedAndWorking,
    MAX(F.Capacity) AS TotalMaxFacilityCapacity,
    SUM(
        CASE 
            WHEN S.Date BETWEEN ? AND ? 
            THEN TIMESTAMPDIFF(HOUR, S.StartTime, S.EndTime) 
            ELSE 0 
        END
    ) AS TotalScheduledHours
  FROM Facilities F
  LEFT JOIN EmploymentRecord ER ON F.FacilityID = ER.FacilityID AND ER.EndDate IS NULL
  LEFT JOIN Employees E ON ER.EmployeeID = E.EmployeeID
  LEFT JOIN Infections I ON E.PersonID = I.PersonID
  LEFT JOIN Schedules S ON E.EmployeeID = S.EmployeeID AND S.FacilityID = F.FacilityID
  GROUP BY F.Province
  ORDER BY F.Province ASC`;

  db.query(query, [startDate, endDate], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(200).json({ error: "Employee not found" });
    }

    // If query is successful, send back the person
    res.json({ results });
  });
}

module.exports = {
  getScheduleForEmployee,
  getQuery16,
  getQuery17,
  getQuery18
};
