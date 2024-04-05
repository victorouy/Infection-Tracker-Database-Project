function getAllFacilities() {
  fetch(`${BASE_URL}/facilities`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("facilitiesTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "FacilityID",
        "Name",    
        "Address",
        "City",
        "Province",
        "PostalCode",
        "PhoneNumber",
        "WebAddress",
        "Type",
        "Capacity",
        "GeneralManagerID",
        "",
        "",
      ]; // Example headers, replace with your actual data keys
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.facilities.forEach((facilities) => {
        var row = table.insertRow();
        Object.entries(facilities).forEach(([key, value]) => {
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
          if (confirm("Are you sure you want to delete this facilities?")) {
            deleteFacilities(facilities.FacilityID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          fillUpdateFormWithFacilitiesData(facilities);
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

function deleteFacilities(FacilityID) {
  fetch(`${BASE_URL}/facilities/${FacilityID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete facilities");
      }
    })
    .catch((error) => {
      console.error("Error deleting facilities:", error);
    });
}

function createFacilities(event) {
  const form = document.getElementById("createFacilitiesForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/facilities`, {
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
        getAllFacilities();
        alert("facilities created successfully");
      } else {
        throw new Error("Failed to create facilities");
      }
    })
    .catch((error) => {
      console.error("Error creating facilities:", error);
    });
}

function fillUpdateFormWithFacilitiesData(facilities) {
  document.getElementById("facilityIDToUpdate").value = facilities.FacilityID;
  document.getElementById("nameToUpdate").value = facilities.Name;
  document.getElementById("addressToUpdate").value = facilities.Address;
  document.getElementById("cityToUpdate").value = facilities.City;
  document.getElementById("provinceToUpdate").value = facilities.Province;
  document.getElementById("postalCodeToUpdate").value = facilities.PostalCode;
  document.getElementById("phoneNumberToUpdate").value = facilities.PhoneNumber;
  document.getElementById("webAddressToUpdate").value = facilities.WebAddress;
  document.getElementById("typeToUpdate").value = facilities.Type;
  document.getElementById("capacityToUpdate").value = facilities.Capacity;
  document.getElementById("generalManagerIDToUpdate").value = facilities.GeneralManagerID;
}

function updateFacilities(event) {
  const form = document.getElementById("updateFacilitiesForm");

  const FacilityID = document.getElementById("facilityIDToUpdate").value;

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // We don't need to pass the FacilityID in the body of the request. The FacilityID is passed in the request parameters.
  delete formDataObject.FacilityID;

  fetch(`${BASE_URL}/facilities/${FacilityID}`, {
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
        getAllFacilities();
        alert(`Facility ${FacilityID} updated successfully`);
      } else {
        throw new Error(`Failed to update Facilties with ID: ${FacilityID}`);
      }
    })
    .catch((error) => {
      console.error("Error creating Facilties:", error);
    });
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}