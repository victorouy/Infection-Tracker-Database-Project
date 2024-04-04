// Import required modules
const personsController = require("./api/PersonsController");
const employeesController = require("./api/EmployeesController");
const vaccinationsController = require("./api/VaccinationsController");
const infectionsController = require("./api/InfectionsController");
const express = require("express");
const cors = require("cors");

// Create express app
const app = express();
app.use(cors());

app.use(express.json());

// #3. Create/Delete/Edit/Display a Person.
app.get("/persons", personsController.getAllPersons);
app.get("/persons/:personId", personsController.getPerson);
app.post("/persons", personsController.createPerson);
app.delete("/persons/:personId", personsController.deletePerson);
app.put("/persons/:personId", personsController.editPerson);

// #4. Create/Delete/Edit/Display a Employee.
app.get("/employees", employeesController.getAllEmployees);
app.post("/employees", employeesController.createEmployee);
app.delete("/employees/:employeeId", employeesController.deleteEmployee);

// #3.2 Create/Delete/Edit/Display a Vaccine
app.get("/vaccines", vaccinationsController.getAllVaccinations);
app.get("/vaccines/:vaccineId", vaccinationsController.getVaccination);
app.post("/vaccines", vaccinationsController.createVaccination);
app.delete("/vaccines/:vaccineId", vaccinationsController.deleteVaccination);
app.put("/vaccines/:vaccineId", vaccinationsController.editVaccination);

//3.3 Create/Delete/Edit/Display a Infection
app.get("/infections", infectionsController.getAllInfections);
app.get("/infections/:infectionId", infectionsController.getInfection);
app.post("/infections", infectionsController.createInfection);
app.delete("/infections/:infectionId", infectionsController.deleteInfection);
app.put("/infections/:infectionId", infectionsController.editInfection);

// Queries
app.get(
  "/employees/schedule/:employeeId/:startDate/:endDate",
  employeesController.getScheduleForEmployee
);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
