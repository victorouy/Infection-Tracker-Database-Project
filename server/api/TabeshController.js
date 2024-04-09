var db = require("../db");

function querySeven(req, res) {}

function queryTen(req, res) {
  const empId = req.params.employeeId;
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;

  const query = `SELECT Facilities.Name, Schedules.Date, Schedules.StartTime, Schedules.EndTime
	FROM Facilities, Schedules
	WHERE Schedules.FacilityID = Facilities.FacilityID AND EmployeeID = ? AND Date BETWEEN ? AND ?
	ORDER BY Facilities.Name ASC, Schedules.Date ASC, Schedules.StartTime ASC`;

  db.query(query, [empId, startDate, endDate], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ results });
  });
}

function queryFourteen(req, res) {
  const facilityId = req.params.facilityId;

  const query = `SELECT Persons.FirstName, Persons.LastName, Employees.Role, COUNT(PersonResidences.Type)
	FROM Persons, Employees, PersonResidences
	WHERE Persons.PersonID = Employees.PersonID AND Persons.PersonID = PersonResidences.PersonID AND Employees.FacilityID = ? AND PersonResidences.Type = 'Secondary'
	GROUP BY Employees.EmployeeID
	HAVING COUNT(PersonResidences.Type) >= 3
	ORDER BY Employees.Role ASC, COUNT(PersonResidences.Type) ASC`;

  db.query(query, [facilityId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length == 0) {
      return res.status(404).json({
        error: "No employee at this facility satisfies the condition",
      });
    }

    res.json({ results });
  });
}

function queryFifteen(req, res) {
  const query = `WITH Nurses AS (
		SELECT DISTINCT Employees.PersonID
		FROM Employees
		WHERE Employees.Role = 'Nurse'
		),
		
		WorkTwoFacilities AS (
		SELECT Employees.PersonID
		FROM Employees, EmploymentRecord
		WHERE Employees.EmployeeID = EmploymentRecord.EmployeeID AND Employees.FacilityID = EmploymentRecord.FacilityID AND EmploymentRecord.EndDate IS NULL
		GROUP BY Employees.PersonID
		HAVING COUNT(DISTINCT EmploymentRecord.FacilityID) >= 2
		),
			
		InfectedCovidLastTwoWeeks AS (
		SELECT DISTINCT Infections.PersonID
		FROM Infections
		WHERE DATEDIFF(CURDATE(), Infections.InfectionDate) <= 14
		),
		
		FirstDayWorkAsNurse AS (
		SELECT Persons.PersonID, EmploymentRecord.StartDate
		FROM Persons
		INNER JOIN Employees ON Persons.PersonID = Employees.PersonID
		INNER JOIN EmploymentRecord ON Employees.EmployeeID = EmploymentRecord.EmployeeID AND Employees.FacilityID = EmploymentRecord.FacilityID
		WHERE Employees.Role = 'Nurse'
		),
		
		AmountInfectedByCOVID AS (
		SELECT Persons.PersonID, COUNT(Infections.InfectionID) AS CovidInfections
		FROM Persons
		INNER JOIN Infections ON Persons.PersonID = Infections.PersonID
		WHERE Infections.InfectionType = 'COVID-19'
		GROUP BY Persons.PersonID
		),
		
		AmountVaccines AS (
		SELECT Persons.PersonID, COUNT(Vaccines.VaccineID) As TotalVaccines
		FROM Persons
		INNER JOIN Vaccines ON Persons.PersonID = Vaccines.PersonID
		GROUP BY Persons.PersonID
		),
		
		TotalHoursScheduled AS (
		SELECT Persons.PersonID, (SUM(TIMESTAMPDIFF(SECOND, Schedules.StartTime, Schedules.EndTime)) / 3600) AS HoursScheduled
		FROM Persons
		INNER JOIN Employees ON Persons.PersonID = Employees.PersonID
		INNER JOIN Schedules ON Employees.EmployeeID = Schedules.EmployeeID
		WHERE Date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 28 DAY)
		),
		
		AmountSecondaryResidences AS (
		SELECT PersonResidences.PersonID, COUNT(PersonResidences.Type) AS SecondaryResidences
		FROM PersonResidences
		WHERE PersonResidences.Type = 'Secondary'
		GROUP BY PersonResidences.PersonID
		)
		
		SELECT FirstName, LastName, StartDate, DateOfBirth, EmailAddress, CovidInfections, TotalVaccines, HoursScheduled, COALESCE(SecondaryResidences, 0) AS SecondaryResidences
		FROM Persons
		INNER JOIN Nurses ON Persons.PersonID = Nurses.PersonID
		INNER JOIN WorkTwoFacilities ON Persons.PersonID = WorkTwoFacilities.PersonID
		INNER JOIN InfectedCovidLastTwoWeeks ON Persons.PersonID = InfectedCovidLastTwoWeeks.PersonID
		INNER JOIN FirstDayWorkAsNurse ON Persons.PersonID = FirstDayWorkAsNurse.PersonID
		INNER JOIN AmountInfectedByCOVID ON Persons.PersonID = AmountInfectedByCOVID.PersonID
		INNER JOIN AmountVaccines ON Persons.PersonID = AmountVaccines.PersonID
		INNER JOIN TotalHoursScheduled ON Persons.PersonID = TotalHoursScheduled.PersonID
		LEFT JOIN AmountSecondaryResidences ON Persons.PersonID = AmountSecondaryResidences.PersonID;`;

  db.query(query, [], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ error: "No nurse fit the criteria" });
    }

    res.json({ results });
  });
}

function queryTwenty(req, res) {}

function getAllSchedules(req, res) {
  const query = `SELECT * FROM Schedules`;

  db.query(query, (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length == 0) {
      return res.status(404).json({ error: "Nothing in the schedules table" });
    }

    res.json({ schedules: results });
  });
}

function deleteSchedule(req, res) {
  const scheduleId = req.params.scheduleId;

  const query = `DELETE FROM Schedules WHERE ScheduleID = ?`;

  db.query(query, [scheduleId], (error, results, fields) => {
    if (error) {
      console.error("Error executing query: " + error.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if any rows were affected (indicating successful deletion)
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Schedule not found" });
    }

    // If deletion is successful, send back success message
    res.json({ message: "Schedule deleted successfully" });
  });
}

function assignSchedule(req, res) {
  const { EmployeeID, FacilityID, Date, StartTime, EndTime } = req.body;

  const query1 = `
	CREATE TEMPORARY TABLE MostRecentVaccinations AS
	(
		SELECT PersonID, MAX(VaccinationDate) AS LatestVaccine
		FROM Vaccines
		GROUP BY PersonID
	)`;

  const query2 = `
	CREATE TEMPORARY TABLE MostRecentCovidInfections AS
	(
		SELECT PersonID, MAX(InfectionDate) AS LatestInfection
		FROM Infections
		WHERE InfectionType = 'COVID-19'
		GROUP BY PersonID
	)
	`;

  const query3 = `
		INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime)
		SELECT ${EmployeeID}, ${FacilityID}, '${Date}', '${StartTime}', '${EndTime}'
		WHERE TIME('${StartTime}') < TIME('${EndTime}')
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
			FROM Schedules
			WHERE EmployeeID = ${EmployeeID}
			AND Date = '${Date}'
			AND TIME('${StartTime}') BETWEEN StartTime AND EndTime
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
			FROM Schedules
			WHERE EmployeeID = ${EmployeeID}
			AND Date = '${Date}'
			AND TIME('${EndTime}') BETWEEN StartTime AND EndTime
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
			FROM Schedules
			WHERE EmployeeID = ${EmployeeID}
				AND Date = '${Date}'
				AND TIME_TO_SEC(TIMEDIFF(EndTime, TIME('${StartTime}'))) < 0
				AND ABS(TIME_TO_SEC(TIMEDIFF(TIME('${StartTime}'), EndTime))) <= 7200
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
			FROM Schedules
			WHERE EmployeeID = ${EmployeeID}
				AND Date = '${Date}'
				AND TIME_TO_SEC(TIMEDIFF(TIME('${EndTime}'), StartTime)) < 0
				AND ABS(TIME_TO_SEC(TIMEDIFF(StartTime, TIME('${EndTime}')))) <= 7200
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
        	FROM MostRecentCovidInfections
				INNER JOIN Employees ON MostRecentCovidInfections.PersonID = Employees.PersonID
			WHERE EmployeeID = ${EmployeeID}
				AND FacilityID = ${FacilityID}
            	AND DATEDIFF(LatestInfection, DATE('${Date}')) <= 0
				AND ABS(DATEDIFF(LatestInfection, DATE('${Date}'))) <= 14
		)
		AND ${EmployeeID} IN # Table of EmployeeID where most recent vaccination is less than 6 months ago
		(
			SELECT EmployeeID
			FROM MostRecentVaccinations
				INNER JOIN Employees ON MostRecentVaccinations.PersonID = Employees.PersonID
			WHERE DATEDIFF(DATE('${Date}'), LatestVaccine) / 30 <= 6
		)
		AND ${EmployeeID} IN
		(
			SELECT EmployeeID
			FROM EmploymentRecord
			WHERE EmployeeID = ${EmployeeID}
			AND FacilityID = ${FacilityID}
			AND EndDate IS NULL
		)`;

  const query4 = `DROP TEMPORARY TABLE MostRecentVaccinations`;
  const query5 = `DROP TEMPORARY TABLE MostRecentCovidInfections`;

  db.query(query1, (error1, results1, fields1) => {
    if (error1) {
      console.error("Error executing query 1: " + error1.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Query 1 executed successfully
    db.query(query2, (error2, results2, fields2) => {
      if (error2) {
        console.error("Error executing query 2: " + error2.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Query 2 executed successfully
      db.query(query3, (error3, results3, fields3) => {
        if (error3) {
          console.error("Error executing query 3: " + error3.stack);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Query 3 executed successfully
        db.query(query4, (error4, results4, fields4) => {
          if (error4) {
            console.error("Error executing query 4: " + error4.stack);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Query 4 executed successfully
          db.query(query5, (error5, results5, fields5) => {
            if (error5) {
              console.error("Error executing query 5: " + error5.stack);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // Query 5 executed successfully
            // If all queries are successful, send back success message
            res.json({ message: "Schedule updated successfully" });
          });
        });
      });
    });
  });
}

function updateSchedule(req, res) {
  const scheduleId = req.params.scheduleId;
  const { EmployeeID, FacilityID, Date, StartTime, EndTime } = req.body;

  const query1 = `
	CREATE TEMPORARY TABLE MostRecentVaccinations AS
	(
		SELECT PersonID, MAX(VaccinationDate) AS LatestVaccine
		FROM Vaccines
		GROUP BY PersonID
	)
	`;

  const query2 = `
	CREATE TEMPORARY TABLE MostRecentCovidInfections AS
	(
		SELECT PersonID, MAX(InfectionDate) AS LatestInfection
		FROM Infections
		WHERE InfectionType = 'COVID-19'
		GROUP BY PersonID
	)
	`;

  const query3 = `
	UPDATE Schedules
	SET FacilityID = ${FacilityID}, Date = '${Date}', StartTime = '${StartTime}', EndTime = '${EndTime}'
	WHERE ScheduleID = ${scheduleId}
		AND TIME('${StartTime}') < TIME('${EndTime}')
		AND ${EmployeeID} NOT IN
		(
			SELECT s1.EmployeeID
			FROM (SELECT * FROM Schedules) AS s1
			WHERE s1.EmployeeID = ${EmployeeID}
				AND s1.ScheduleID != ${scheduleId}
				AND s1.Date = '${Date}'
				AND TIME('${StartTime}') BETWEEN s1.StartTime AND s1.EndTime
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT s2.EmployeeID
			FROM (SELECT * FROM Schedules) AS s2
			WHERE s2.EmployeeID = ${EmployeeID}
				AND s2.ScheduleID != ${scheduleId}
				AND s2.Date = '${Date}'
				AND TIME('${EndTime}') BETWEEN s2.StartTime AND s2.EndTime
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT s3.EmployeeID
			FROM (SELECT * FROM Schedules) AS s3
			WHERE s3.EmployeeID = ${EmployeeID}
				AND s3.ScheduleID != ${scheduleId}
				AND s3.Date = '${Date}'
				AND TIME_TO_SEC(TIMEDIFF(EndTime, TIME('${StartTime}'))) < 0
				AND ABS(TIME_TO_SEC(TIMEDIFF(TIME('${StartTime}'), s3.EndTime))) <= 7200
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT s4.EmployeeID
			FROM (SELECT * FROM Schedules) AS s4
			WHERE s4.EmployeeID = ${EmployeeID}
				AND s4.ScheduleID != ${scheduleId}
				AND s4.Date = '${Date}'
				AND TIME_TO_SEC(TIMEDIFF(TIME('${EndTime}'), StartTime)) < 0
				AND ABS(TIME_TO_SEC(TIMEDIFF(s4.StartTime, TIME('${EndTime}')))) <= 7200
		)
		AND ${EmployeeID} NOT IN
		(
			SELECT EmployeeID
        	FROM MostRecentCovidInfections
				INNER JOIN Employees ON MostRecentCovidInfections.PersonID = Employees.PersonID
			WHERE EmployeeID = ${EmployeeID}
				AND FacilityID = ${FacilityID}
            	AND DATEDIFF(LatestInfection, DATE('${Date}')) <= 0
				AND ABS(DATEDIFF(LatestInfection, DATE('${Date}'))) <= 14
		)
		AND ${EmployeeID} IN # Table of EmployeeID where most recent vaccination is less than 6 months ago
		(
			SELECT EmployeeID
			FROM MostRecentVaccinations
				INNER JOIN Employees ON MostRecentVaccinations.PersonID = Employees.PersonID
			WHERE DATEDIFF(LatestVaccine, DATE('${Date}')) < 0
				AND ABS(DATEDIFF(LatestVaccine, DATE('${Date}'))) / 30 <= 6
		)
		AND ${EmployeeID} IN
		(
			SELECT EmployeeID
			FROM EmploymentRecord
			WHERE EmployeeID = ${EmployeeID}
				AND FacilityID = ${FacilityID}
				AND EndDate IS NULL
		)
	`;

  const query4 = `DROP TEMPORARY TABLE MostRecentVaccinations`;
  const query5 = `DROP TEMPORARY TABLE MostRecentCovidInfections`;

  db.query(query1, (error1, results1, fields1) => {
    if (error1) {
      console.error("Error executing query 1: " + error1.stack);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Query 1 executed successfully
    db.query(query2, (error2, results2, fields2) => {
      if (error2) {
        console.error("Error executing query 2: " + error2.stack);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Query 2 executed successfully
      db.query(query3, (error3, results3, fields3) => {
        if (error3) {
          console.error("Error executing query 3: " + error3.stack);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Query 3 executed successfully
        db.query(query4, (error4, results4, fields4) => {
          if (error4) {
            console.error("Error executing query 4: " + error4.stack);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          // Query 4 executed successfully
          db.query(query5, (error5, results5, fields5) => {
            if (error5) {
              console.error("Error executing query 5: " + error5.stack);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            // Query 5 executed successfully
            // If all queries are successful, send back success message
            res.json({ message: "Schedule updated successfully" });
          });
        });
      });
    });
  });
}

// Function to get schedules for all employees within a given time frame
async function getEmployeeSchedulesDuringTimeframe(startDate, endDate) {
  const sql = `
	SELECT Employees.EmployeeID, Facilities.FacilityID, Facilities.Name as FacilityName, Facilities.Address, Persons.FirstName, Persons.LastName, Persons.EmailAddress, Employees.Role,
	Schedules.Date, Schedules.StartTime, Schedules.EndTime
	FROM Employees
	INNER JOIN Persons ON Employees.PersonID = Persons.PersonID
	INNER JOIN Schedules ON Employees.EmployeeID = Schedules.EmployeeID
	INNER JOIN Facilities ON Schedules.FacilityID = Facilities.FacilityID
	WHERE Schedules.Date BETWEEN '${startDate}' and '${endDate}'
	`;

  return new Promise((resolve, reject) => {
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(results);
    });
  });
}

module.exports = {
  querySeven,
  queryTen,
  queryFourteen,
  queryFifteen,
  queryTwenty,
  getAllSchedules,
  deleteSchedule,
  assignSchedule,
  updateSchedule,
  getEmployeeSchedulesDuringTimeframe,
};
