function getAllResidence() {
  fetch(`${BASE_URL}/residence`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("residenceTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
          "ResidenceID",
          "Type",
          "Address",
          "City",
          "Province",
          "PostalCode",
          "PhoneNumber",
          "NumberOfBedrooms",
        "",
        "",
      ]; // Example headers, replace with your actual data keys
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.residence.forEach((residence) => {
        var row = table.insertRow();
        Object.entries(residence).forEach(([key, value]) => {
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
          if (confirm("Are you sure you want to delete this residence?")) {
            deleteResidence(residence.ResidenceID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          fillUpdateFormWithResidenceData(residence);
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

function deleteResidence(ResidenceID) {
  fetch(`${BASE_URL}/residence/${ResidenceID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete residence");
      }
    })
    .catch((error) => {
      console.error("Error deleting residence:", error);
    });
}

function createResidence(event) {
  const form = document.getElementById("createResidenceForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/residence`, {
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
        getAllResidence();
        alert("residence created successfully");
      } else {
        throw new Error("Failed to create residence");
      }
    })
    .catch((error) => {
      console.error("Error creating residence:", error);
    });
}

function fillUpdateFormWithResidenceData(residence) {
  document.getElementById("residenceIDToUpdate").value = residence.ResidenceID;
  //console.log(residence.ResidenceID);
  document.getElementById("TypeToUpdate").value = residence.Type;
  //console.log(residence.Type);
  document.getElementById("AddressToUpdate").value = residence.Address;
  //console.log(residence.Address);

  document.getElementById("CityToUpdate").value = residence.City;
  //console.log(residence.City);

  document.getElementById("ProvinceToUpdate").value =
  residence.Province;
  //console.log(residence.Province);
  document.getElementById("PostalCodeToUpdate").value =
  residence.PostalCode;
  //console.log(residence.PostalCode);
  document.getElementById("PhoneNumberToUpdate").value =
  residence.PhoneNumber;
  //console.log(residence.PhoneNumber);
  document.getElementById("numberOfBedroomsToUpdate").value = residence.NumberOfBedrooms;
  //console.log(residence.NumberOfBedrooms);
}

function updateResidence(event) {
  const form = document.getElementById("updateResidenceForm");

  const ResidenceID = document.getElementById("residenceIDToUpdate").value;

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // We don't need to pass the ResidenceID in the body of the request. The ResidenceID is passed in the request parameters.
  delete formDataObject.ResidenceID;

  fetch(`${BASE_URL}/residence/${ResidenceID}`, {
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
        getAllResidence();
        alert(`residence ${ResidenceID} updated successfully`);
      } else {
        throw new Error(`Failed to update residence with ID: ${ResidenceID}`);
      }
    })
    .catch((error) => {
      console.error("Error creating residence:", error);
    });
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
