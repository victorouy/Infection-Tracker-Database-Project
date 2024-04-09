function getAllEmails() {
  fetch(`${BASE_URL}/emails`)
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("emailsTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "Date",
        "Sender",
        "Receiver",
        "Subject",
        "Body",
        "Reason",
        "",
        "",
      ];

      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.results.forEach((email) => {
        var row = table.insertRow();
        Object.entries(email).forEach(([key, value]) => {
          var cell = row.insertCell();
          if (key == "Date") {
            cell.textContent = formatDate(value);
          } else if (key == "Body") {
            cell.textContent = value + "...";
          } else {
            cell.textContent = value;
          }
        });
      });

      // Append table to table container
      tableContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
