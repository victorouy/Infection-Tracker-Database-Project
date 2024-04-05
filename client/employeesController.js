function getSchedule(event) {
  event.preventDefault();
  const empId = document.getElementById("queryTenEmployeeId").value;
  const startDate = document.getElementById("queryTenStartDate").value;
  const endDate = document.getElementById("queryTenEndDate").value;

  fetch(`${BASE_URL}/employees/schedule/${empId}/${startDate}/${endDate}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayQueryResult(data);
    })
    .catch((error) => {
      console.error("Error getting schedule", error);
    });
}

function getAllEmployees() {
  fetch(`${BASE_URL}/employees`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("employeesTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "EmployeeID",
        "PersonID",
        "FirstName",
        "LastName",
        "Role",
        "FacilityID",
        "FacilityName",
        "",
        "",
      ];

      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.employees.forEach((employee) => {
        var row = table.insertRow();
        Object.entries(employee).forEach(([key, value]) => {
          var cell = row.insertCell();
          cell.textContent = value;
        });

        // Add delete button to each row
        var deleteButtonCell = row.insertCell();
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", function () {
          if (confirm("Are you sure you want to delete this Employee?")) {
            deleteEmployee(employee.EmployeeID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          fillUpdateFormWithEmployeeData(employee);
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

function deleteEmployee(employeeID) {
  fetch(`${BASE_URL}/employees/${employeeID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
    })
    .catch((error) => {
      console.error("Error deleting employee:", error);
    });
}

function createEmployee(event) {
  const form = document.getElementById("createEmployeeForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          alert("The PersonID and FacilityID must exist.");
        } else if (response.status === 409) {
          alert("This person is already an employee.");
        } else {
          throw new Error("Could not create a new employee");
        }
      } else {
        form.reset();
        getAllEmployees();
        alert("Employee created successfully");
      }
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
}

function fillUpdateFormWithEmployeeData(employee) {
  document.getElementById("employeeIdToUpdate").value = employee.EmployeeID;
  document.getElementById("roleToUpdate").value = employee.Role;
  document.getElementById("employeeFacilityToUpdate").value =
    employee.FacilityID;
}

function updateEmployee(event) {
  const form = document.getElementById("updateEmployeeForm");

  const employeeId = document.getElementById("employeeIdToUpdate").value;

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  // We don't update the PersonID or EmployeeID when editing an Employee
  delete formDataObject.PersonID;
  delete formDataObject.EmployeeID;

  fetch(`${BASE_URL}/employees/${employeeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formDataObject),
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 404) {
          alert("The EmployeeID and FacilityID must exist.");
        } else {
          throw new Error("Could not update the employee");
        }
      } else {
        form.reset();
        getAllEmployees();
        alert("Employee updated successfully");
      }
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
}

function formatDate(dateToFormat) {
  const date = new Date(dateToFormat);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getQuery9(event) {
  event.preventDefault();

  fetch(`${BASE_URL}/employees/9`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get query9");
      }
      return response.json();
    })
    .then((data) => {
      data.results.forEach((tuple) => {
        if ("StartDate" in tuple) {
          tuple.StartDate = formatDate(tuple.StartDate);
        }
        if ("DateOfBirth" in tuple) {
          tuple.DateOfBirth = formatDate(tuple.DateOfBirth);
        }
      });
      displayQueryResult(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getQuery16(event) {
  event.preventDefault();

  fetch(`${BASE_URL}/employees/16`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayQueryResult(data);
    })
    .catch((error) => {
      console.error("Error getting schedule", error);
    });
}

function getQuery17(event) {
  event.preventDefault();

  fetch(`${BASE_URL}/employees/17`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayQueryResult(data);
    })
    .catch((error) => {
      console.error("Error getting schedule", error);
    });
}

function getQuery18(event) {
  event.preventDefault();

  const startDate = document.getElementById("queryScheduleFrom").value;
  const endDate = document.getElementById("queryScheduleTo").value;

  fetch(`${BASE_URL}/employees/18/${startDate}/${endDate}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      displayQueryResult(data);
    })
    .catch((error) => {
      console.error("Error getting schedule", error);
    });
}
