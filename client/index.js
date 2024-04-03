const BASE_URL = "http://localhost:5000";

function openTab(event, tabName) {
  var i, tabContent, tabLinks;
  tabContent = document.getElementsByClassName("tab-content");
  for (i = 0; i < tabContent.length; i++) {
    tabContent[i].style.display = "none"; // Hide all tab contents
  }
  tabLinks = document.getElementsByTagName("a");
  for (i = 0; i < tabLinks.length; i++) {
    tabLinks[i].classList.remove("active"); // Remove active class from all tab links
  }
  document.getElementById(tabName).style.display = "block"; // Show the content of the selected tab
  event.currentTarget.classList.add("active"); // Add active class to the clicked tab link

  if (tabName === "Persons") {
    getAllPersons();
  }

  event.preventDefault();
}

function displayQueryResult(jsonData) {
  clearTable();

  const tableContainer = document.getElementById("queryTableContainer");

  const headers = Object.keys(jsonData.results[0]);

  const table = document.createElement("table");

  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  jsonData.results.forEach((result) => {
    const row = document.createElement("tr");
    headers.forEach((header) => {
      const cell = document.createElement("td");
      cell.textContent = result[header];
      row.appendChild(cell);
    });
    table.appendChild(row);
  });

  tableContainer.appendChild(table);
}

function clearTable() {
  const tableContainer = document.getElementById("queryTableContainer");
  while (tableContainer.firstChild) {
    tableContainer.removeChild(tableContainer.firstChild);
  }
}
