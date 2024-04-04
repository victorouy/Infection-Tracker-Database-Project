function getAllInfections() {
  fetch(`${BASE_URL}/infections`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("infectionsTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "InfectionID", 
        "PersonID",
        "InfectionDate", 
        "InfectionEndDate",
        "InfectionType", 
        "", 
        "",
    ];
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.infections.forEach((infection) => {
        var row = table.insertRow();
        Object.entries(infection).forEach(([key, value]) => {
          var cell = row.insertCell();
          if (key == "InfectionDate" || key == "InfectionEndDate") {
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
          if (confirm("Are you sure you want to delete this infection?")) {
            deleteInfection(infection.InfectionID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          fillUpdateFormWithInfectionData(infection);
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

function deleteInfection(infectionID) {
  fetch(`${BASE_URL}/infections/${infectionID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete infection");
      }
    })
    .catch((error) => {
      console.error("Error deleting infection:", error);
    });
}

function createInfection(event) {
  const form = document.getElementById("createInfectionForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    console.log(value);
    if (value == "") {
      formDataObject[key] = null;
    } else {
      formDataObject[key] = value;
    }
  });

  fetch(`${BASE_URL}/infections`, {
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
        getAllInfections();
        alert("Infection created successfully");
      } else {
        throw new Error("Failed to create infection");
      }
    })
    .catch((error) => {
      console.error("Error creating infection:", error);
    });
}

function updateInfection(event) {
    const form = document.getElementById("updateInfectionForm");
  
    const infectionId = document.getElementById("infectionIdToUpdate").value;
  
    event.preventDefault();
  
    const formData = new FormData(form);
  
    // Convert FormData to object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    // We don't need to pass the infectionId in the body of the request. The infectionId is passed in the request parameters.
    delete formDataObject.InfectionId;
  
    fetch(`${BASE_URL}/infections/${infectionId}`, {
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
          getAllInfections();
          alert(`Infection ${infectionId} updated successfully`);
        } else {
          throw new Error(`Failed to update infection with ID: ${infectionId}`);
        }
      })
      .catch((error) => {
        console.error("Error updating infection:", error);
      });
}  

function fillUpdateFormWithInfectionData(infection) {
    document.getElementById("infectionIdToUpdate").value = infection.InfectionID;
    document.getElementById("personIdInfectionToUpdate").value = infection.PersonID;
    document.getElementById("infectionDateToUpdate").value = formatDate(infection.InfectionDate);
    document.getElementById("infectionEndDateToUpdate").value = formatDate(infection.InfectionEndDate);
    document.getElementById("infectionTypeToUpdate").value = infection.InfectionType;
  }

function formatDate(dateToFormat) {
  if (dateToFormat == null) {
    return 'Currently Infected';
  }
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
