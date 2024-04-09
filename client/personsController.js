function getAllPersons() {
  fetch(`${BASE_URL}/persons`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("personsTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "PersonID",
        "FirstName",
        "LastName",
        "DateOfBirth",
        "SocialSecurityNumber",
        "MedicareCardNumber",
        "TelephoneNumber",
        "Citizenship",
        "EmailAddress",
        "Occupation",
        "",
        "",
      ]; // Example headers, replace with your actual data keys
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.persons.forEach((person) => {
        var row = table.insertRow();
        Object.entries(person).forEach(([key, value]) => {
          var cell = row.insertCell();
          if (key == "DateOfBirth") {
            cell.textContent = formatDate(value);
          } else {
            cell.textContent = value;
          }
        });

        // Add delete button to each row
        var deleteButtonCell = row.insertCell();
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          if (confirm("Are you sure you want to delete this Person?")) {
            deletePerson(person.PersonID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          fillUpdateFormWithPersonData(person);
        });
        updateButtonCell.appendChild(updateButton);
      });

      // Append table to table container
      tableContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function deletePerson(personID) {
  fetch(`${BASE_URL}/persons/${personID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete person");
      }
    })
    .catch((error) => {
      console.error("Error deleting person:", error);
    });
}

function createPerson(event) {
  const form = document.getElementById("createPersonForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/persons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (response.ok) {
        form.reset();

        // Refresh the table with new data
        getAllPersons();
        alert("Person created successfully");
      } else {
        throw new Error("Failed to create person");
      }
    })
    .catch((error) => {
      console.error("Error creating person:", error);
    });
}

function fillUpdateFormWithPersonData(person) {
  document.getElementById("personIdToUpdate").value = person.PersonID;
  document.getElementById("firstNameToUpdate").value = person.FirstName;
  document.getElementById("lastNameToUpdate").value = person.LastName;

  document.getElementById("dateOfBirthToUpdate").value = formatDate(
    person.DateOfBirth
  );

  document.getElementById("socialSecurityNumberToUpdate").value =
    person.SocialSecurityNumber;
  document.getElementById("medicareCardNumberToUpdate").value =
    person.MedicareCardNumber;
  document.getElementById("telephoneNumberToUpdate").value =
    person.TelephoneNumber;
  document.getElementById("citizenshipToUpdate").value = person.Citizenship;
  document.getElementById("emailAddressToUpdate").value = person.EmailAddress;
  document.getElementById("occupationToUpdate").value = person.Occupation;
}

function updatePerson(event) {
  const form = document.getElementById("updatePersonForm");

  const personId = document.getElementById("personIdToUpdate").value;

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // We don't need to pass the personId in the body of the request. The personId is passed in the request parameters.
  delete formDataObject.PersonId;

  fetch(`${BASE_URL}/persons/${personId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (response.ok) {
        form.reset();

        // Refresh the table with new data
        getAllPersons();
        alert(`Person ${personId} updated successfully`);
      } else {
        throw new Error(`Failed to update person with ID: ${personId}`);
      }
    })
    .catch((error) => {
      console.error("Error creating person:", error);
    });
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
