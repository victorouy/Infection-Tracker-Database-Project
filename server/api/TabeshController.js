var db = require("../db");

function querySeven(req, res)
{
}

function queryTen(req, res)
{
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

function queryFourteen(req, res)
{
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
			return res.status(404).json({ error: "No employee at this facility satisfies the condition" });
		}
		
		res.json({ results });
	});
}

function queryFifteen(req, res)
{
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

function queryTwenty(req, res)
{
}

function getAllSchedules(req, res)
{
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

function deleteSchedule(req, res)
{
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

function assignSchedule(req, res)
{
	const {
		EmployeeID,
		FacilityID,
		Date,
		StartTime,
		EndTime,
	  } = req.body;
	
	  const query = `
	  	  CREATE TEMPORARY TABLE MostRecentVaccination AS
		  (
		    SELECT PersonID, MAX(VaccinationDate) AS LatestVaccine
			FROM Vaccines
			GROUP BY PersonID
		  );

		  INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime)
		  SELECT ?, ?, ?, ?, ?
		  WHERE TIME('?') < TIME('?') # StartTime, EndTime
		    AND ? NOT IN
			(
			  SELECT EmployeeID
			  FROM Schedules
			  WHERE EmployeeID = ?
			    AND TIME('?') BETWEEN StartTime AND EndTime # StartTime
			)
			AND ? NOT IN
			(
			  SELECT EmployeeID
			  FROM Schedules
			  WHERE EmployeeID = ?
			    AND TIME('?') BETWEEN StartTime AND EndTime # EndTime
			)
			AND ? NOT IN
			(
				SELECT EmployeeID
				FROM Schedules
				WHERE EmployeeID = ?
				  AND ABS(TIME_TO_SEC(TIMEDIFF(TIME(?), EndTime))) <= 7200
			)
			AND ? NOT IN
			(
				SELECT EmployeeID
				FROM Schedules
				WHERE EmployeeID = ?
				  AND ABS(TIME_TO_SEC(TIMEDIFF(StartTime, TIME(?)))) <= 7200
			)
			AND ? NOT IN
			(
				SELECT EmployeeID
				FROM Infections, Employees
				WHERE Infections.PersonID = Employees.PersonID
				  AND EmployeeID = ?
				  AND InfectionType = 'COVID-19'
				  AND DATEDIFF(DATE('?'), InfectionDate) <= 14
			)
			AND ? IN # Table of EmployeeID where most recent vaccination is less than 6 months ago
			(
				SELECT EmployeeID
				FROM MostRecentVaccination
				  INNER JOIN Employees ON MostRecentVaccination.PersonID = Employees.PersonID
				WHERE DATEDIFF(DATE('?'), VaccinationDate) / 30 <= 6
			);
			
			DROP TEMPORARY TABLE MostRecentVaccination;`;
	
	  // Values to be inserted
	  const values = [
		EmployeeID,
		FacilityID,
		Date,
		StartTime,
		EndTime,
		StartTime,
		EndTime,
		EmployeeID,
		EmployeeID,
		StartTime,
		EmployeeID,
		EmployeeID,
		EndTime,
		EmployeeID,
		EmployeeID,
		StartTime,
		EmployeeID,
		EmployeeID,
		EndTime,
		EmployeeID,
		EmployeeID,
		Date,
		EmployeeID,
		Date,
	  ];
	
	  // Perform the query
	  db.query(query, values, (error, results, fields) => {
		if (error) {
		  console.error("Error executing query: " + error.stack);
		  return res.status(500).json({ error: "Internal Server Error" });
		}
	
		// If insertion is successful, send back success message
		res.json({ message: "Schedule assigned successfully" });
	  });
}

function updateSchedule(req, res)
{
	const scheduleId = req.params.scheduleId;
	const {
	  EmployeeID,
	  FacilityID,
	  Date,
	  StartTime,
	  EndTime,
	} = req.body;
  
	const query = `
	  UPDATE Schedules
	  SET EmployeeID = ?,
		  FacilityID = ?,
		  Date = ?,
		  StartTime = ?,
		  EndTime = ?
	  WHERE ScheduleID = ?
	`;
  
	const values = [
	  EmployeeID,
	  FacilityID,
	  Date,
	  StartTime,
	  EndTime,
	  scheduleId,
	];
  
	db.query(query, values, (error, results, fields) => {
	  if (error) {
		console.error("Error executing query: " + error.stack);
		return res.status(500).json({ error: "Internal Server Error" });
	  }
  
	  if (results.affectedRows === 0) {
		return res.status(404).json({ error: "Schedule not found" });
	  }
  
	  res.json({ message: "Schedule updated successfully" });
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
};
