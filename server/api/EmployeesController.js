var db = require("../db");

function getScheduleForEmployee(req, res) {
  const empId = req.params.employeeId;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

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

  // Check if PersonID exists in Persons table
  const personCheckQuery =
    "SELECT COUNT(*) AS personCount FROM Persons WHERE PersonID = ?";

  // Check if the FacilityID exists in the Facilities table
  const facilityCheckQuery =
    "SELECT COUNT(*) AS facilityCount FROM Facilities WHERE FacilityID = ?";

  db.query(
    employeeCheckQuery,
    PersonID,
    (employeeCheckError, employeeCheckResults, employeeCheckFields) => {
      if (employeeCheckError) {
        console.error(
          "Error executing EmployeeID check query: " + employeeCheckError.stack
        );
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const employeeCount = employeeCheckResults[0].employeeCount;
      if (employeeCount > 0) {
        return res
          .status(409)
          .json({ error: "PersonID is already an employee" });
      }

      db.query(
        personCheckQuery,
        PersonID,
        (personCheckError, personCheckResults, personCheckFields) => {
          if (personCheckError) {
            console.error(
              "Error executing PersonID check query: " + personCheckError.stack
            );
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const personCount = personCheckResults[0].personCount;
          if (personCount === 0) {
            return res.status(404).json({ error: "PersonID does not exist" });
          }

          db.query(
            facilityCheckQuery,
            FacilityID,
            (facilityCheckError, facilityCheckResults, facilityCheckFields) => {
              if (facilityCheckError) {
                console.error(
                  "Error executing FacilityID check query: " +
                    facilityCheckError.stack
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              const facilityCount = facilityCheckResults[0].facilityCount;
              if (facilityCount === 0) {
                return res
                  .status(404)
                  .json({ error: "FacilityID does not exist" });
              }

              const insertQuery = `INSERT INTO Employees (PersonID, Role, FacilityID) VALUES (?, ?, ?)`;
              const insertValues = [PersonID, Role, FacilityID];

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

function editEmployee(req, res) {
  const employeeId = req.params.employeeId;

  const { Role, FacilityID } = req.body;

  // Check if the EmployeeID exists in the Employees table
  const employeeExistsCheck =
    "SELECT COUNT(*) AS employeeCount FROM Employees WHERE EmployeeID = ?";

  // Check if the FacilityID exists in the Facilities table
  const facilityCheckQuery =
    "SELECT COUNT(*) AS facilityCount FROM Facilities WHERE FacilityID = ?";

  db.query(
    employeeExistsCheck,
    employeeId,
    (employeeCheckError, employeeCheckResults) => {
      if (employeeCheckError) {
        console.error(
          "Error executing EmployeeID check query: " + employeeCheckError.stack
        );
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const employeeCount = employeeCheckResults[0].employeeCount;
      if (employeeCount === 0) {
        return res.status(404).json({ error: "EmployeeID does not exist" });
      }

      db.query(
        facilityCheckQuery,
        FacilityID,
        (facilityCheckError, facilityCheckResults) => {
          if (facilityCheckError) {
            console.error(
              "Error executing FacilityID check query: " +
                facilityCheckError.stack
            );
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const facilityCount = facilityCheckResults[0].facilityCount;
          if (facilityCount === 0) {
            return res.status(404).json({ error: "FacilityID does not exist" });
          }

          const updateQuery =
            "UPDATE Employees SET Role = ?, FacilityID = ? WHERE EmployeeID = ?";
          const insertValues = [Role, FacilityID, employeeId];

          db.query(
            updateQuery,
            insertValues,
            (insertError, insertResults, insertFields) => {
              if (insertError) {
                console.error(
                  "Error executing Update query: " + insertError.stack
                );
                return res.status(500).json({ error: "Internal Server Error" });
              }

              res.json({ message: "Employee updated successfully" });
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

function getQuery9(req, res) {
  const query = `
  WITH EmployeesCurrentlyWorkingAtFacilityAndSecondaryResidences AS (
    SELECT er.EmployeeID, COUNT(pr.ResidenceID) AS SecondaryResidences, er.StartDate
    FROM EmploymentRecord er
    JOIN Employees e ON er.EmployeeID = e.EmployeeID
    JOIN Persons p ON e.PersonID = p.PersonID
    JOIN PersonResidences pr ON pr.PersonID = p.PersonID
    WHERE er.EndDate IS NULL AND pr.Type = 'Secondary'
    GROUP BY er.EmployeeID
    HAVING SecondaryResidences > 0
    )
    SELECT 
        e.EmployeeID,
        p.FirstName,
        p.LastName,
        employeesCurrentlyWorking.StartDate,
        p.DateOfBirth,
        p.MedicareCardNumber,
        p.TelephoneNumber,
        r.Address AS PrimaryAddress,
        r.City,
        r.Province,
        r.PostalCode,
        p.Citizenship,
        p.EmailAddress,
        employeesCurrentlyWorking.SecondaryResidences
    FROM 
        Employees e
    JOIN 
        Persons p ON e.PersonID = p.PersonID
    JOIN 
        PersonResidences pr ON p.PersonID = pr.PersonID
    JOIN 
        Residence r ON pr.ResidenceID = r.ResidenceID
    JOIN
      EmployeesCurrentlyWorkingAtFacilityAndSecondaryResidences employeesCurrentlyWorking ON e.EmployeeID = employeesCurrentlyWorking.EmployeeID
    WHERE 
        pr.Type = 'Primary'
      AND
        e.EmployeeID = employeesCurrentlyWorking.EmployeeID
    GROUP BY 
        e.EmployeeID
    ORDER BY 
      e.EmployeeID,
        p.FirstName,
        p.LastName;
    `;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.json({ results });
  });
}
function getQuery11(req, res) {
  const employeeId = req.params.employeeId;
  const query = `
 Select X.ResidenceID,X.Type,Y.FirstName,Y.LastName,Y.Occupation,EPR.RelationshipType
from(
Select E.EmployeeID,P.PersonID As P_ID,PR.*
from Employees As E
join Persons As P on E.PersonID = P.PersonID
join PersonResidences as PR on PR.PersonID = P.PersonID
)As X
Join(
Select P.*,PR.ResidenceID,PR.Type
from Persons As P
join PersonResidences as PR on PR.PersonID = P.PersonID

) as Y on X.ResidenceID = Y.ResidenceID and X.P_ID != Y.PersonId
Join EmployeePersonRelationship As EPR on Y.PersonId= EPR.PersonID
where X.EmployeeID = ?
    `;

  db.query(query, employeeId,(error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

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
  getAllEmployees,
  deleteEmployee,
  createEmployee,
  editEmployee,
  getQuery9,
  getQuery11,
  getQuery16,
  getQuery17,
  getQuery18,
};
