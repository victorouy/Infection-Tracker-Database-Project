# Infection Tracker Database Project

This full-stack project, with a focus on the database aspect, is designed to manage and streamline the operations of a facility management system. The system encompasses various aspects of facilities, residences, employees, and their interactions. The primary goal is to ensure data integrity and efficient handling of information through normalization and the establishment of functional dependencies.

## Client-side

The user interface was created using JavaScript, HTML, and CSS. The client is responsible for:
- Handling user input.
- Making HTTP requests to the server to fetch information.
- Creating, editing, and deleting entities.

## Server-side

The server, created using NodeJS and Express, is responsible for:
- Receiving requests from the client.
- Directly interacting with the database hosted by AITS.
- Feeding the requested information back to the client by creating APIs.

## Database

- Tables and data are stored in the remote database hosted by AITS.
- The client can only access the database through the server, without any direct access to the database.

## E/R Diagram
![image](https://github.com/victorouy/Infection-Tracker-Database-Project/assets/76132903/560e5c93-4333-4a87-95c6-d307b7bcf62b)
