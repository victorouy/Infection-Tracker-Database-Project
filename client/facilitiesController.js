function getAllFacilities() {
    fetch(`${BASE_URL}/facilities`)
      .then((response) => response.json())
      .then((data) => {
        // Clear previous table content
        var tableContainer = document.getElementById("FacilitiesTableContainer");
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
              cell.textContent = value;
            
          });
  
          // Add delete button to each row
          var deleteButtonCell = row.insertCell();
          var deleteButton = document.createElement("button");
          deleteButton.textContent = "Delete";
          deleteButton.addEventListener("click", function () {
            if (confirm("Are you sure you want to delete this Facility?")) {
              deleteFacility(Facility.FacilityID);
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
          throw new Error("Failed to delete Facilities");
        }
      })
      .catch((error) => {
        console.error("Error deleting Facilities:", error);
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
          alert("Facilities created successfully");
        } else {
          throw new Error("Failed to create Facilities");
        }
      })
      .catch((error) => {
        console.error("Error creating Facilities:", error);
      });
  }
  
  function fillUpdateFormWithFacilitiesData(facilities) {
    document.getElementById("facilityIdToUpdate").value = facilities.facilityid;
    document.getElementById("nameToUpdate").value = facilities.name;
    document.getElementById("addressToUpdate").value = facilities.address;
    document.getElementById("cityToUpdate").value = facilities.city;
    document.getElementById("provinceToUpdate").value = facilities.province;
    document.getElementById("postalCodeToUpdate").value = facilities.postalcode;
    document.getElementById("phoneNumberToUpdate").value = facilities.phonenumber;
    document.getElementById("webAddressToUpdate").value = facilities.webaddress;
    document.getElementById("typeToUpdate").value = facilities.type;
    document.getElementById("capacityToUpdate").value = facilities.capacity;
    document.getElementById("generalManagerIdToUpdate").value = facilities.general_manager_id;
}
  
  function updateFacilities(event) {
    const form = document.getElementById("updateFacilitiesForm");
  
    const FacilityId = document.getElementById("FacilityIdToUpdate").value;
  
    event.preventDefault();
  
    const formData = new FormData(form);
  
    // Convert FormData to object
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
  
    // We don't need to pass the FacilityId in the body of the request. The FacilitiesId is passed in the request parameters.
    delete formDataObject.FacilityId;
  
    fetch(`${BASE_URL}/facilities/${FacilityId}`, {
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
          alert(`Facilities ${FacilityId} updated successfully`);
        } else {
          throw new Error(`Failed to update Facilities with ID: ${FacilityId}`);
        }
      })
      .catch((error) => {
        console.error("Error creating Facilities:", error);
      });
  }
  
  function formatDate(dateToFormat) {
    const date = new Date(dateToFormat);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }