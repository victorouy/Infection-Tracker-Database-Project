function getAllVaccinations() {
    fetch(`${BASE_URL}/vaccines`)
      .then((response) => response.json())
      .then((data) => {
        // Clear previous table content
        var tableContainer = document.getElementById("vaccinationsTableContainer");
        tableContainer.innerHTML = "";
  
        // Create table header
        var table = document.createElement("table");
        var headerRow = table.insertRow();
        var headers = [
          "VaccineID",
          "PersonID",
          "FacilityID",
          "VaccinationType",
          "VaccinationDate",
          "DoseNumber",
          "",
          "",
        ]; // Example headers, replace with your actual data keys
        headers.forEach((header) => {
          var th = document.createElement("th");
          th.textContent = header;
          headerRow.appendChild(th);
        });
  
        // Populate table with data
        data.vaccinations.forEach((vaccination) => {
          var row = table.insertRow();
          Object.entries(vaccination).forEach(([key, value]) => {
            var cell = row.insertCell();
            if (key == "VaccinationDate") {
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
            if (confirm("Are you sure you want to delete this Vaccination?")) {
              deleteVaccination(vaccination.VaccineID);
              table.deleteRow(row.rowIndex);
            }
          });
          deleteButtonCell.appendChild(deleteButton);
  
          // Add update button to each row
          var updateButtonCell = row.insertCell();
          var updateButton = document.createElement("button");
          updateButton.textContent = "Update";
          updateButton.addEventListener("click", function () {
            fillUpdateFormWithVaccinationData(vaccination);
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

function createVaccination(event) {
  const form = document.getElementById("createVaccinationForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/vaccines`, {
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
        getAllVaccinations();
        alert("Vaccination created successfully");
      } else {
        throw new Error("Failed to create vaccination");
      }
    })
    .catch((error) => {
      console.error("Error creating vaccination:", error);
    });
}

function deleteVaccination(vaccineID) {
  fetch(`${BASE_URL}/vaccines/${vaccineID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete vaccine");
      }
    })
    .catch((error) => {
      console.error("Error deleting vaccine:", error);
    });
}

function updateVaccination(event) {
  const form = document.getElementById("updateVaccinationForm");

  const vaccineId = document.getElementById("vaccineIdToUpdate").value;

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // We don't need to pass the personId in the body of the request. The personId is passed in the request parameters.
  delete formDataObject.VaccineId;

  fetch(`${BASE_URL}/vaccines/${vaccineId}`, {
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
        getAllVaccinations();
        alert(`Vaccination ${vaccineId} updated successfully`);
      } else {
        throw new Error(`Failed to update vaccination with ID: ${vaccineId}`);
      }
    })
    .catch((error) => {
      console.error("Error creating vaccination:", error);
    });
}

  function fillUpdateFormWithVaccinationData(vaccination) {
    document.getElementById("vaccineIdToUpdate").value = vaccination.VaccineID;
    document.getElementById("personIDToUpdate").value = vaccination.PersonID;
    document.getElementById("facilityIDToUpdate").value = vaccination.FacilityID;
    document.getElementById("vaccinationTypeToUpdate").value = vaccination.VaccinationType;
    document.getElementById("vaccinationDateToUpdate").value = formatDate(vaccination.VaccinationDate);
    document.getElementById("doseNumberToUpdate").value = vaccination.DoseNumber;
  }

  function formatDate(dateToFormat) {
    const date = new Date(dateToFormat);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  