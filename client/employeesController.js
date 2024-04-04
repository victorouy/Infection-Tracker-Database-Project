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