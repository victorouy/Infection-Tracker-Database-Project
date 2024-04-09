var db = require("../db");
const emailController = require("./EmailController");

function getAllInfections(req, res) {
  // SQL query to select all infections
  const query = "SELECT * FROM Infections";

  // Perform the query
  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // If query is successful, send back the results
    res.json({ infections: results });
  });
}

function getInfection(req, res) {
  const infectionId = req.params.infectionId;

  // SQL query to select a specific Infection by InfectionID
  const query = "SELECT * FROM Infections WHERE InfectionID = ?";

  // Perform the query
  db.query(query, [infectionId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were returned
    if (results.length === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If query is successful, send back the infection
    res.json({ infection: results[0] });
  });
}

async function createInfection(req, res) {
  const { PersonID, InfectionDate, InfectionEndDate, InfectionType } = req.body;

  // SQL query to insert a new Infection into the DB
  const query = `
      INSERT INTO Infections (
        PersonID,
        InfectionDate,
        InfectionEndDate,
        InfectionType
      ) VALUES (?, ?, ?, ?)
    `;

  // Values to be inserted
  const values = [PersonID, InfectionDate, InfectionEndDate, InfectionType];

  try {
    // Perform the query
    await new Promise((resolve, reject) => {
      db.query(query, values, (error, results, fields) => {
        if (error) {
          console.error("Error executing query: " + error.stack);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (String(InfectionType).toUpperCase() === "COVID-19") {
      await cancelScheduledAssignmentsIfEmployee(PersonID, InfectionDate);
    }

    console.log(`Infection for Person ${PersonID} successfully created`);
    // If insertion is successful, send back success message
    res.json({ message: "Infection created successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function cancelScheduledAssignmentsIfEmployee(PersonID, InfectionDate) {
  const infectionDate = new Date(InfectionDate);
  const twoWeeksFromInfectionDate = new Date(
    infectionDate.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  const getEmployeeInfoQuery =
    "SELECT e.EmployeeID, p.EmailAddress FROM Employees e JOIN Persons p ON e.PersonID = p.PersonID WHERE e.PersonID = ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(getEmployeeInfoQuery, [PersonID], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    // Only cancel the assignments if the person is an employee
    if (results.length > 0) {
      const employeeId = results[0].EmployeeID;
      const areSchedulesDeleted = await cancelScheduledAssignments(
        employeeId,
        infectionDate,
        twoWeeksFromInfectionDate
      );

      if (areSchedulesDeleted) {
        const emailsOfEmployeesWhoWorkedWithInfected =
          await getEmailsOfEmployeesWhoWorkedWithInfected(
            employeeId,
            InfectionDate
          );

        // call here
        const facilityID = await getFacilityIdWhereEmployeeWorks(employeeId);

        // Email all employees who worked with the infected person
        if (emailsOfEmployeesWhoWorkedWithInfected) {
          for (const tuple of emailsOfEmployeesWhoWorkedWithInfected) {
            const subject = "Warning";
            const body =
              "One of your colleagues with whom you worked in the past two weeks has been infected with COVID-19";
            await emailController.sendEmail(
              facilityID,
              tuple.EmailAddress,
              subject,
              body,
              "Warning"
            );
          }
        } else {
          console.log("There are no employees who worked with the infected");
        }

        const emailAddress = results[0].EmailAddress;

        // Send email to infected employee letting them know that their scheduled assignments are cancelled
        if (emailAddress) {
          const subject =
            "Notice: Cancelled Scheduled Assignments due to your infection!";
          const body =
            "Hello Dear Employee, your shifts scheduled between today and two weeks from now are cancelled due to your infection.";
          await emailController.sendEmail(
            facilityID,
            emailAddress,
            subject,
            body,
            "Cancellation"
          );
        } else {
          console.log("Email address is null or undefined");
        }
      }
    }
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    throw new Error("Error retrieving employee information");
  }
}

async function getFacilityIdWhereEmployeeWorks(employeeId) {
  const query = `SELECT DISTINCT FacilityID FROM EmploymentRecord WHERE EmployeeID = ${employeeId} and EndDate is null`;

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(query, (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    if (results.length > 0) {
      return results[0].FacilityID;
    } else {
      console.log("Employee doesn't work in a facility");
    }
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    throw new Error("Error retrieving facilityID of the employee");
  }
}

async function getEmailsOfEmployeesWhoWorkedWithInfected(
  employeeId,
  infectionStartDate
) {
  try {
    const infectionDate = new Date(infectionStartDate);
    const twoWeeksBeforeInfectionDate = formatDate(
      new Date(infectionDate.getTime() - 14 * 24 * 60 * 60 * 1000)
    );

    const getEmailsOfEmployeesWhoWorkedWithInfectedQuery = `
    WITH FacilityWithInfected AS 
    (SELECT DISTINCT FacilityID from Schedules WHERE EmployeeID = ${employeeId} and Date between "${twoWeeksBeforeInfectionDate}" and "${infectionStartDate}")
    SELECT s.FacilityID, p.EmailAddress FROM Schedules s 
    JOIN Employees e on s.EmployeeID = e.EmployeeID 
    JOIN Persons p ON e.PersonID = p.PersonID
    JOIN FacilityWithInfected ON s.FacilityID = FacilityWithInfected.FacilityID
    WHERE (s.Date BETWEEN "${twoWeeksBeforeInfectionDate}" and "${infectionStartDate}") and (s.EmployeeID <> ${employeeId});
    `;

    const results = await new Promise((resolve, reject) => {
      db.query(
        getEmailsOfEmployeesWhoWorkedWithInfectedQuery,
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results.length > 0) {
      return results;
    } else {
      console.log(
        "Nobody worked with this infected employee in the past two weeks."
      );
    }
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    throw new Error(
      "Error retrieving emails of employees who worked with infected. "
    );
  }
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function cancelScheduledAssignments(
  employeeId,
  infectionDate,
  twoWeeksFromInfectionDate
) {
  const deleteScheduledAssignmentsQuery =
    "DELETE FROM Schedules WHERE EmployeeID = ? and Date BETWEEN ? AND ?";

  try {
    const results = await new Promise((resolve, reject) => {
      db.query(
        deleteScheduledAssignmentsQuery,
        [employeeId, infectionDate, twoWeeksFromInfectionDate],
        (error, results, fields) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results && results.affectedRows > 0) {
      console.log(
        `Successfully deleted all scheduled assignments for employee ${employeeId}`
      );
      return true;
    } else {
      console.log(`No scheduled assignments found for employee ${employeeId}`);
      return false;
    }
  } catch (error) {
    console.error("Error executing query: " + error.stack);
    throw new Error("Error canceling scheduled assignments");
  }
}

function deleteInfection(req, res) {
  const infectionId = req.params.infectionId;

  // SQL query to delete an Infection by InfectionID
  const query = "DELETE FROM Infections WHERE InfectionID = ?";

  // Perform the query
  db.query(query, [infectionId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Infection deleted successfully" });
  });
}

function editInfection(req, res) {
  const infectionId = req.params.infectionId;
  const { PersonID, InfectionDate, InfectionEndDate, InfectionType } = req.body;

  // SQL query to update an Infection by InfectionID
  const query = `
    UPDATE Infections
    SET PersonID = ?,
        InfectionDate = ?,
        InfectionEndDate = ?,
        InfectionType = ? 
    WHERE InfectionID = ?
  `;

  // Values to be updated
  const values = [
    PersonID,
    InfectionDate,
    InfectionEndDate,
    InfectionType,
    infectionId,
  ];

  // Perform the query
  db.query(query, values, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful update)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Infection not found" });
    }

    // If update is successful, send back success message
    res.json({ message: "Infection updated successfully" });
  });
}
function getQuery12(req, res) {
  const query = `
  Select X.FirstName,LastName,X.FacilityName,I.InfectionDate,Y.NumberOFSecondaryRes
From(
Select E.EmployeeID,P.PersonID As P_ID,P.FirstName,P.LastName,F.name AS FacilityName
	from Employees As E
    join Persons As P on E.PersonID = P.PersonID
    Join Facilities AS F on E.FacilityID=F.FacilityID
	WHERE E.Role = "Doctor"
    
         )AS X
        left Join(
         Select P.PersonID as P_ID2,COALESCE(count(X.Type)) AS NumberOFSecondaryRes
		from Persons AS P
		left Join(
		select PersonResidences.PersonID,PersonResidences.Type
		from PersonResidences
		where Type = "Secondary")AS X on P.PersonID = X.PersonID
		GROUP BY X.PersonID
		)AS Y ON X.P_ID =Y.P_ID2
join Infections As I on X.P_ID = I.PersonID
where I.InfectionEndDate is NULL
ORDER BY X.FacilityName,Y.NumberOFSecondaryRes;

`;

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
    console.log(results+"This is from the server qeury")
    res.json({ results });
  });
}
module.exports = {
  getAllInfections,
  getInfection,
  createInfection,
  deleteInfection,
  editInfection,
  getQuery12,
};
