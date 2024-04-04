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
  JOIN Facilities f on e.FacilityID = f.FacilityID ORDER BY e.EmployeeID ASC`;

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

function createEmployee(req, res) {
  const { PersonID, Role, FacilityID } = req.body;

  // Check if PersonID is already in Employees table
  const employeeCheckQuery =
    "SELECT COUNT(*) AS employeeCount FROM Employees WHERE PersonID = ?";

  // Values for the EmployeeID check query
  const employeeCheckValues = [PersonID];

  // Perform the EmployeeID check query
  db.query(
    employeeCheckQuery,
    employeeCheckValues,
    (employeeCheckError, employeeCheckResults, employeeCheckFields) => {
      if (employeeCheckError) {
        console.error(
          "Error executing EmployeeID check query: " + employeeCheckError.stack
        );
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check if PersonID is already in Employees table
      const employeeCount = employeeCheckResults[0].employeeCount;
      if (employeeCount > 0) {
        return res
          .status(409)
          .json({ error: "PersonID is already an employee" });
      }

      // Check if PersonID exists
      const personCheckQuery =
        "SELECT COUNT(*) AS personCount FROM Persons WHERE PersonID = ?";

      // Values for the PersonID check query
      const personCheckValues = [PersonID];

      // Perform the PersonID check query
      db.query(
        personCheckQuery,
        personCheckValues,
        (personCheckError, personCheckResults, personCheckFields) => {
          if (personCheckError) {
            console.error(
              "Error executing PersonID check query: " + personCheckError.stack
            );
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Check if PersonID exists
          const personCount = personCheckResults[0].personCount;
          if (personCount === 0) {
            return res.status(404).json({ error: "PersonID does not exist" });
          }

          const facilityCheckQuery =
            "SELECT COUNT(*) AS facilityCount FROM Facilities WHERE FacilityID = ?";

          // Values for the FacilityID check query
          const facilityCheckValues = [FacilityID];

          // Perform the FacilityID check query
          db.query(
            facilityCheckQuery,
            facilityCheckValues,
            (facilityCheckError, facilityCheckResults, facilityCheckFields) => {
              if (facilityCheckError) {
                console.error(
                  "Error executing FacilityID check query: " +
                    facilityCheckError.stack
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              // Check if FacilityID exists
              const facilityCount = facilityCheckResults[0].facilityCount;
              if (facilityCount === 0) {
                return res
                  .status(404)
                  .json({ error: "FacilityID does not exist" });
              }

              // If both PersonID and FacilityID exist, execute the INSERT query
              const insertQuery = `INSERT INTO Employees (PersonID, Role, FacilityID) VALUES (?, ?, ?)`;
              const insertValues = [PersonID, Role, FacilityID];

              // Perform the INSERT query
              db.query(
                insertQuery,
                insertValues,
                (insertError, insertResults, insertFields) => {
                  if (insertError) {
                    console.error(
                      "Error executing INSERT query: " + insertError.stack
                    );
                    return res
                      .status(500)
                      .json({ error: "Internal Server Error" });
                  }

                  // If insertion is successful, send back success message
                  res.json({ message: "Employee created successfully" });
                }
              );
            }
          );
        }
      );
    }
  );
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

  const queriesToExecute = [
    deleteFromEmployeesQuery,
    deleteFromEmployeePersonRelationshipQuery,
    deleteFromSchedulesQuery,
    deleteFromEmploymentRecordQuery,
  ];

  try {
    db.query("SET FOREIGN_KEY_CHECKS = 0");

    for (let query of queriesToExecute) {
      db.query(query, [employeeId]);
    }

    db.query("SET FOREIGN_KEY_CHECKS = 1");
  } catch (err) {
    console.error("Error executing deleteEmployee query: " + error.stack);
  }

  res.json({ message: "Person deleted successfully" });
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
  getAllEmployees,
  deleteEmployee,
  createEmployee,
  getQuery16,
  getQuery17,
  getQuery18,
};
