function queryTen(event)
{
	event.preventDefault();
	const empId = document.getElementById("queryTenEmployeeId").value;
	const startDate = document.getElementById("queryTenStartDate").value;
	const endDate = document.getElementById("queryTenEndDate").value;
	
	fetch(`${BASE_URL}/queryten/${empId}/${startDate}/${endDate}`, {
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

function queryFourteen(event)
{
	event.preventDefault();
	const facilityId = document.getElementById("queryFourteenFacilityID").value;
	
	fetch(`${BASE_URL}/queryfourteen/${facilityId}`, {
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
	console.error("Error retrieving employees", error);
	});
}

function queryFifteen(event)
{
	event.preventDefault();
	
	fetch(`${BASE_URL}/queryfifteen`, {
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
	console.error("Error retrieving nurses", error);
	});
}

function queryTwenty(event)
{
}

function getAllSchedules()
{
	fetch(`${BASE_URL}/schedules`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("schedulesTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "ScheduleID",
        "EmployeeID",
        "FacilityID",
        "Date",
        "Start Time",
        "End Time",
        "",
        "",
      ]; // Example headers, replace with your actual data keys
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.schedules.forEach((schedule) => {
        var row = table.insertRow();
        Object.entries(schedule).forEach(([key, value]) => {
          var cell = row.insertCell();
          if (key == "Date") {
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
          if (confirm("Are you sure you want to delete this schedule?")) {
            deleteSchedule(schedule.ScheduleID);
            table.deleteRow(row.rowIndex);
          }
        });
        deleteButtonCell.appendChild(deleteButton);

        // Add update button to each row
        var updateButtonCell = row.insertCell();
        var updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", function () {
          //fillUpdateFormWithScheduleData(schedule);
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

function deleteSchedule(scheduleID)
{
  fetch(`${BASE_URL}/schedules/${scheduleID}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }
    })
    .catch((error) => {
      console.error("Error deleting schedule:", error);
    });
}

function assignSchedule(event)
{
  const form = document.getElementById("assignScheduleForm");

  event.preventDefault();

  const formData = new FormData(form);

  // Convert FormData to object
  const formDataObject = {};
  formData.forEach((value, key) => {
    formDataObject[key] = value;
  });

  fetch(`${BASE_URL}/schedules`, {
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
        getAllSchedules();
        alert("Schedule assigned successfully");
      } else {
        throw new Error("Failed to assign schedule");
      }
    })
    .catch((error) => {
      console.error("Error creating schedule:", error);
    });
}

