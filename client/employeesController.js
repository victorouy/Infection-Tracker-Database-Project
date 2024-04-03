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
