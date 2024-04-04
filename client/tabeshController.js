function querySeven(event)
{
}

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

