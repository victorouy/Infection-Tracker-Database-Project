// Import required modules
const personsController = require("./api/PersonsController");
const express = require("express");

// Create express app
const app = express();

app.use(express.json());

// #3. Create/Delete/Edit/Display a Person.
app.get("/persons", personsController.getAllPersons);
app.get("/persons/:personId", personsController.getPerson);
app.post("/persons", personsController.createPerson);
app.delete("/persons/:personId", personsController.deletePerson);
app.put("/persons/:personId", personsController.editPerson);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
