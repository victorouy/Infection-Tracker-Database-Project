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

function getAllPersons() {
  fetch("http://localhost:5000/persons")
    .then((response) => response.json())
    .then((data) => {
      // Clear previous table content
      var tableContainer = document.getElementById("personsTableContainer");
      tableContainer.innerHTML = "";

      // Create table header
      var table = document.createElement("table");
      var headerRow = table.insertRow();
      var headers = [
        "PersonID",
        "FirstName",
        "LastName",
        "DateOfBirth",
        "SocialSecurityNumber",
        "MedicareCardNumber",
        "TelephoneNumber",
        "Citizenship",
        "EmailAddress",
      ]; // Example headers, replace with your actual data keys
      headers.forEach((header) => {
        var th = document.createElement("th");
        th.textContent = header;
        headerRow.appendChild(th);
      });

      // Populate table with data
      data.persons.forEach((person) => {
        var row = table.insertRow();
        Object.values(person).forEach((value) => {
          var cell = row.insertCell();
          cell.textContent = value;
        });
      });

      // Append table to table container
      tableContainer.appendChild(table);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
