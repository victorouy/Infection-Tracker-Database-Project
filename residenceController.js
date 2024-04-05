function getAllResidence() {
    fetch(`${BASE_URL}/residence`)
      .then((response) => response.json())
      .then((data) => {
        // Clear previous table content
        var tableContainer = document.getElementById("ResidenceTableContainer");
        tableContainer.innerHTML = "";
  
        // Create table header
        var table = document.createElement("table");
        var headerRow = table.insertRow();
        var headers = [
          "ResidenceId",
          "Type",
          "Address",
          "City",
          "Province",
          "PostalCode",
          "PhoneNumber",
          "NumbeOfBedrooms",
          "",
          "",
        ]; // Example headers, replace with your actual data keys
        headers.forEach((header) => {
          var th = document.createElement("th");
          th.textContent = header;
          headerRow.appendChild(th);
        });
  
        // Populate table with data
        data.persons.forEach((residence) => {
          var row = table.insertRow();
          Object.entries(residence).forEach(([key, value]) => {
            var cell = row.insertCell();
              cell.textContent = value;
          });
  
          // Add delete button to each row
          var deleteButtonCell = row.insertCell();
          var deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this Residence?")) {
              deleteResidence(residence.residenceId);
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
  
  function deleteResidence(residenceId) {
    fetch(`${BASE_URL}/residence/${residenceId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete Residence");
        }
      })
      .catch((error) => {
        console.error("Error deleting Residence:", error);
      });
  }
  
  function createPerson(event) {
    const form = document.getElementById("createResidenceForm");
  
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
          getAllResidence();
          alert("Residence created successfully");
        } else {
          throw new Error("Failed to create Residence");
        }
      })
      .catch((error) => {
        console.error("Error creating Residence:", error);
      });
  }
  
  function fillUpdateFormWithResidenceData(residence) {
    document.getElementById("residenceIdToUpdate").value = residence.residenceId;
    document.getElementById("typeToUpdate").value = residence.type;
    document.getElementById("addressToUpdate").value = residence.address;
    document.getElementById("cityToUpdate").value = residence.city;
    document.getElementById("provinceToUpdate").value = residence.province;
    document.getElementById("postalCodeToUpdate").value = residence.postalcode;
    document.getElementById("phoneNumberToUpdate").value = residence.phonenumber;
    document.getElementById("numberofbedroomsToUpdate").value = residence.numberofbedrooms;
  }
  
  function updateResidence(event) {
    const form = document.getElementById("updateResidenceForm");
  
    const residenceId = document.getElementById("residenceIdToUpdate").value;
  
    event.preventDefault();
  
    const formData = new FormData(form);
  
    // Convert FormData to object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    // We don't need to pass the residenceId in the body of the request. The residenceId is passed in the request parameters.
    delete formDataObject.residenceId;
  
    fetch(`${BASE_URL}/residence/${residenceId}`, {
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
          alert(`Residence ${residenceId} updated successfully`);
        } else {
          throw new Error(`Failed to update Residence with ID: ${residenceId}`);
        }
      })
      .catch((error) => {
        console.error("Error creating Residence:", error);
      });
  }
  
 
  