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
