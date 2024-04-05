USE vjc353_4;

# Use these if you need to DROP all constraints and tables
/*
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Facilities;
DROP TABLE IF EXISTS Persons;
DROP TABLE IF EXISTS Residence;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS EmploymentRecord;
DROP TABLE IF EXISTS Vaccines;
DROP TABLE IF EXISTS Infections;
DROP TABLE IF EXISTS EmployeePersonRelationship;
DROP TABLE IF EXISTS PersonResidences;
DROP TABLE IF EXISTS Schedules;
SET FOREIGN_KEY_CHECKS = 1;
*/

CREATE TABLE Facilities (
    FacilityID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    Address VARCHAR(255),
    City VARCHAR(50),
    Province VARCHAR(50),
    PostalCode VARCHAR(20),
    PhoneNumber VARCHAR(30),
    WebAddress VARCHAR(255),
    Type VARCHAR(50), -- Ex: Hospital, CLSC, Clinic, Pharmacy, Special Installment
    Capacity INT,
    GeneralManagerID INT
);

CREATE TABLE Residence (
    ResidenceID INT PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(50), -- Ex: Apartment, Condominium, Semidetached House, House
    Address VARCHAR(255),
    City VARCHAR(50),
    Province VARCHAR(50),
    PostalCode VARCHAR(10),
    PhoneNumber VARCHAR(20),
    NumberOfBedrooms INT
);

CREATE TABLE Persons (
    PersonID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    DateOfBirth DATE,
    SocialSecurityNumber VARCHAR(20) UNIQUE NOT NULL,
    MedicareCardNumber VARCHAR(20) UNIQUE NOT NULL,
    TelephoneNumber VARCHAR(20),
    Citizenship VARCHAR(50),
    EmailAddress VARCHAR(50)
);

# A person must have one primary residence and can have multiple secondary residences
CREATE TABLE PersonResidences (
	PersonID INT,
    ResidenceID INT,
    Type VARCHAR(20) DEFAULT 'Primary' # Can either be Primary or Secondary
);

CREATE TABLE Employees (
    EmployeeID INT PRIMARY KEY AUTO_INCREMENT,
    PersonID INT,
    Role VARCHAR(50), -- Ex: Nurse, Doctor, Cashier, Pharmacist, Receptionist, Administrative Personnel, Security Personnel, Regular Employee
    FacilityID INT
);

CREATE TABLE EmploymentRecord (
	EmployeeID INT,
    FacilityID INT,
    StartDate DATE,
    EndDate DATE
);

CREATE TABLE Vaccines (
    VaccineID INT PRIMARY KEY AUTO_INCREMENT,
    PersonID INT,
    FacilityID INT,
    VaccinationType VARCHAR(50), -- Ex: Pfizer, Moderna, AstraZeneca, Johnson & Johnson
    VaccinationDate DATE,
    DoseNumber INT
);

CREATE TABLE Infections (
    InfectionID INT PRIMARY KEY AUTO_INCREMENT,
    PersonID INT,
    InfectionDate DATE,
    InfectionEndDate DATE,
    InfectionType VARCHAR(50) -- Ex: COVID-19, SARS-Cov-2 Variant, Other Types
);

CREATE TABLE EmployeePersonRelationship (
    RelationshipID INT PRIMARY KEY AUTO_INCREMENT,
    EmployeeID INT,
    PersonID INT,
    RelationshipType VARCHAR(50) -- Ex: Roommate, Partner, Parent, Dependent
);

CREATE TABLE Schedules (
ScheduleID INT PRIMARY KEY AUTO_INCREMENT,
EmployeeID INT,
FacilityID INT,
Date DATE,
StartTime TIME,
EndTime TIME,
FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID),
FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID)
);

ALTER TABLE Facilities ADD CONSTRAINT FK_Facilities_Employees FOREIGN KEY (GeneralManagerID) REFERENCES Employees(EmployeeID);
ALTER TABLE Employees ADD CONSTRAINT FK_Employees_Persons FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
ALTER TABLE Employees ADD CONSTRAINT FK_Employees_Facilities FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID);
ALTER TABLE EmploymentRecord ADD CONSTRAINT FK_EmploymentRecord_Employees FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);
ALTER TABLE EmploymentRecord ADD CONSTRAINT FK_EmploymentRecord_Facilities FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID);
ALTER TABLE Vaccines ADD CONSTRAINT FK_Vaccines_Persons FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
ALTER TABLE Vaccines ADD CONSTRAINT FK_Vaccines_Facilities FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID);
ALTER TABLE Infections ADD CONSTRAINT FK_Infections_Persons FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
ALTER TABLE EmployeePersonRelationship ADD CONSTRAINT FK_EmployeePersonRelationships_Employees FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);
ALTER TABLE EmployeePersonRelationship ADD CONSTRAINT FK_EmployeePersonRelationships_Persons FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
ALTER TABLE PersonResidences ADD CONSTRAINT FK_PersonResidences_Persons FOREIGN KEY (PersonID) REFERENCES Persons(PersonID);
ALTER TABLE PersonResidences ADD CONSTRAINT FK_PersonResidences_Residence FOREIGN KEY (ResidenceID) REFERENCES Residence(ResidenceID);
ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Employees FOREIGN KEY (EmployeeID) REFERENCES Employees(EmployeeID);
ALTER TABLE Schedules ADD CONSTRAINT FK_Schedules_Facilities FOREIGN KEY (FacilityID) REFERENCES Facilities(FacilityID);






