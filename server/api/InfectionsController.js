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

  // Perform the query
  await db.query(query, values, async (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (String(InfectionType).toUpperCase() === "COVID-19") {
      await cancelScheduledAssignmentsIfEmployee(PersonID, InfectionDate);
    }

    console.log(`Infection for Person ${PersonID} successfully created`);
    // If insertion is successful, send back success message
    res.json({ message: "Infection created successfully" });
  });
}

async function cancelScheduledAssignmentsIfEmployee(PersonID, InfectionDate) {
  const infectionDate = new Date(InfectionDate);
  const twoWeeksFromInfectionDate = new Date(
    infectionDate.getTime() + 14 * 24 * 60 * 60 * 1000
  );

  const getEmployeeIdQuery =
    "SELECT EmployeeID FROM Employees WHERE PersonID = ?";

  await db.query(
    getEmployeeIdQuery,
    [PersonID],
    async (error, results, fields) => {
      // Only cancel the assignments if the person is an employee
      if (results.length > 0) {
        const employeeId = results[0].EmployeeID;
        await cancelScheduledAssignments(
          employeeId,
          infectionDate,
          twoWeeksFromInfectionDate
        );

        // Send email to infected employee letting them know that their scheduled assignments are cancelled
        const personEmailAddress = await getPersonEmail(PersonID);
        if (!personEmailAddress) {
          console.log(personEmailAddress);
          const subject =
            "Notice: Cancelled Scheduled Assignments due to your infection!";
          const body =
            "Hello Dear Employee, your shifts scheduled between today and two weeks from now are cancelled due to your infection.";
          emailController.sendEmail(personEmailAddress, subject, body);
        } else {
          console.log("its null");
        }
      }
    }
  );
}

async function cancelScheduledAssignments(
  employeeId,
  infectionDate,
  twoWeeksFromInfectionDate
) {
  const deleteScheduledAssignmentsQuery =
    "DELETE FROM Schedules WHERE EmployeeID = ? and Date BETWEEN ? AND ?";

  await db.query(
    deleteScheduledAssignmentsQuery,
    [employeeId, infectionDate, twoWeeksFromInfectionDate],
    (results) => {
      if (!results) {
        console.log(
          `Successfully deleted all scheduled assignments for employee ${employeeId}`
        );
      }
    }
  );
}

// (async () => {
//   try {
//     const personId = 1; // Replace with the actual person ID
//     const emailAddress = await getEmailAddressByPersonId(personId);
//     if (emailAddress) {
//       console.log("Email Address:", emailAddress);
//     } else {
//       console.log("No email address found for person ID:", personId);
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   } finally {
//   }
// })();

async function getPersonEmail(personId) {
  // SQL query
  const sql = "SELECT EmailAddress FROM Persons WHERE PersonID = ?";

  // Wrap the database operation in a promise
  return new Promise((resolve, reject) => {
    // Execute the query
    db.query(sql, [personId], (err, results) => {
      if (err) {
        reject(err);
        return;
      }

      // Check if any results were returned
      if (results.length > 0) {
        resolve(results[0].EmailAddress); // Assuming only one row is returned
      } else {
        resolve(null); // No email address found for the given personId
      }
    });
  });
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

module.exports = {
  getAllInfections,
  getInfection,
  createInfection,
  deleteInfection,
  editInfection,
};
