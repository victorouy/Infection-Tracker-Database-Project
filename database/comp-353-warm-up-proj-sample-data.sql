SET FOREIGN_KEY_CHECKS = 0;


# Residences
INSERT INTO Residence VALUES
(1, 'Apartment', '59 Chair Street', 'Montreal', 'Quebec', 'A1B2C3', '5145592486', 2),
(2, 'Condominium', '16 Carpet Avenue', 'Laval', 'Quebec', 'B3F8G0', '4505892344', 3),
(3, 'Semidetached House', '47 Table Boulevard', 'Dorval', 'Quebec', 'C6J2S3', '5149082452', 4),
(4, 'House', '79 Teapot Street', 'Quebec City', 'Quebec', 'D9R4U5', '4182857563', 2),
(5, 'Apartment', '27 Pillow Avenue', 'Montreal', 'Quebec', 'E7V0H1', '5147754234', 3),
(6, 'Condominium', '35 Sofa Boulevard', 'Laval', 'Quebec', 'F1K5J2', '4506427530', 4),
(7, 'Semidetached House', '42 Blanket Street', 'Dorval', 'Quebec', 'G2X6Y1', '5143489553', 2),
(8, 'House', '68 Fridge Avenue', 'Quebec City', 'Quebec', 'H9W1S5', '4184984581', 3),
(9, 'Apartment', '85 Closet Boulevard', 'Montreal', 'Quebec', 'I3J6F9', '5141045489', 4),
(10, 'Condominium', '96 Drawer Street', 'Laval', 'Quebec', 'J5D6Z3', '4503789531', 2),
(11, 'Apartment', '123 Main Street', 'Toronto', 'Ontario', 'M1A2B3', '4161234567', 5),
(12, 'Condominium', '456 Oak Avenue', 'Mississauga', 'Ontario', 'L4C5E6', '9052345678', 6),
(13, 'Semidetached House', '789 Maple Drive', 'Brampton', 'Ontario', 'N2O3P4', '9053456789',
4),
(14, 'House', '101 Pine Street', 'Hamilton', 'Ontario', 'H8I9J0', '9054567890', 6),
(15, 'Apartment', '202 Elm Avenue', 'Ottawa', 'Ontario', 'K1L2M3', '6135678901', 3),
(16, 'Condominium', '303 Birch Boulevard', 'London', 'Ontario', 'L5N6O7', '5196789012', 5),
(17, 'Semidetached House', '404 Cedar Street', 'Windsor', 'Ontario', 'W2X3Y4', '5197890123', 2),
(18, 'House', '505 Oak Avenue', 'Kitchener', 'Ontario', 'N3Z4A5', '5198901234', 5),
(19, 'Apartment', '606 Maple Drive', 'Guelph', 'Ontario', 'G6H7I8', '5199012345', 3),
(20, 'Condominium', '707 Pine Street', 'Cambridge', 'Ontario', 'C9J0K1', '5190123456', 4),
(21, 'Semidetached House', '808 Elm Avenue', 'Barrie', 'Ontario', 'B1L2M3', '7051234567', 3),
(22, 'House', '909 Birch Boulevard', 'St. Catharines', 'Ontario', 'S3N4O5', '9052345678', 6),
(23, 'Apartment', '1010 Cedar Street', 'Markham', 'Ontario', 'M6P7Q8', '9053456789', 2),
(24, 'Condominium', '1111 Oak Avenue', 'Richmond Hill', 'Ontario', 'R8S9T0', '9054567890', 5),
(25, 'Semidetached House', '1212 Maple Drive', 'Vaughan', 'Ontario', 'V1W2X3', '9055678901', 4),
(26, 'House', '405 Jubistreet', 'Toronto', 'Ontario', 'H1L2M4', '9055178901', 2),
(27, 'House', '123 Mayflower', 'Lincoln', 'Ontario', 'J4LE23', '9055178555', 2),
(28, 'Apartment', '1111 Poggers Street', 'Markham', 'Ontario', 'M6P7Y6', '9052356789', 2),
(29, 'Condominium', '999 Galib Street', 'Markham Hill', 'Ontario', 'R8S9T0', '9014467890', 5),
(30, 'Semidetached House', '144 Mikkelson', 'Vaughan', 'Ontario', 'H5DJ5G', '90556781111', 4),
(31, 'House', '111 Venice Road', 'Toronto', 'Ontario', 'H1L5M5', '1155178901', 2),
(32, 'House', '678 Yeti Road', 'Lincoln', 'Ontario', 'J4LE24', '9055178444', 2),
(33, 'House', '555 Godiva Road', 'Montreal', 'Quebec', 'H1LM64', '9125178444', 2);


# Administrative Personnel
INSERT INTO Persons (PersonID, FirstName, LastName, DateOfBirth, SocialSecurityNumber, MedicareCardNumber, TelephoneNumber, Citizenship, EmailAddress) VALUES
(1, 'John', 'Doe', '1980-05-15', '121-45-6789', 'MC123456789', '(555) 111-1111', 'Canada', 'john.doe@email.com'),
(2, 'Jane', 'Smith', '1995-08-20', '987-35-4321', 'MC987654321', '(555) 222-2222', 'United States', 'jane.smith@email.com'),
(3, 'David', 'Johnson', '1988-12-10', '355-67-8901', 'MC345676601', '(555) 333-3333', 'United Kingdom', 'david.johnson@email.com'),
(4, 'Emily', 'White', '2000-03-25', '567-89-0123', 'MC567890145', '(555) 444-4444', 'France', 'emily.white@email.com'),
(5, 'Michael', 'Johnson', '1985-07-20', '234-56-3890', 'MC234567890', '(555) 555-5555', 'Canada', 'michael.johnson@email.com'),
(6, 'Sarah', 'Anderson', '1990-09-12', '345-67-8928', 'MC345678901', '(555) 666-6666', 'United States', 'sarah.anderson@email.com'),
(7, 'Daniel', 'Brown', '1982-04-03', '456-78-9018', 'MC456789012', '(555) 777-7777', 'United Kingdom', 'daniel.brown@email.com'),
(8, 'Olivia', 'Miller', '1998-12-28', '567-89-0128', 'MC567890123', '(555) 888-8888', 'France', 'olivia.miller@email.com'),
(9, 'Christopher', 'Smith', '1975-01-05', '678-90-1234', 'MC678901234', '(555) 999-9999', 'Australia', 'christopher.smith@email.com'),
(10, 'Sophia', 'Davis', '1989-06-15', '789-01-2346', 'MC789012345', '(555) 123-4567', 'Canada', 'sophia.davis@email.com'),
(39, 'Mike', 'Wazowski', '1975-06-15', '450-01-1111', 'MC789019988', '(555) 123-4545', 'Canada', 'mike.wazowski@email.com');


INSERT INTO PersonResidences (PersonID, ResidenceID) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(39, 27);

INSERT INTO PersonResidences VALUES (1, 50, 'Secondary'),
(1, 51, 'Secondary'),
(1, 52, 'Secondary');

INSERT INTO PersonResidences VALUES (21, 63, 'Secondary');
INSERT INTO PersonResidences (PersonID, ResidenceID, Type) VALUES
(1, 28, 'Secondary'),
(2, 29, 'Secondary'),
(3, 30, 'Secondary'),
(4, 31, 'Secondary'),
(5, 32, 'Secondary'),
(5, 33, 'Secondary');


# Persons who live in the same residence as the Employees
INSERT INTO Persons (PersonID, FirstName, LastName, DateOfBirth, SocialSecurityNumber, MedicareCardNumber, TelephoneNumber, Citizenship, EmailAddress) VALUES
(11, 'Michaela', 'Johnson', '1982-03-10', '111-22-3339', 'MC15223333', '(555) 123-1111', 'Canada', 'michaela.johnson@email.com'),
(12, 'Ryan', 'Anderson', '1985-06-25', '222-33-4441', 'MC222764444', '(555) 234-2222', 'United States', 'ryan.anderson@email.com'),
(13, 'Sophie', 'Brown', '1990-09-08', '333-44-5552', 'MC332445555', '(555) 345-3333', 'United Kingdom', 'sophie.brown@email.com'),
(14, 'Oscar', 'Miller', '1978-11-15', '444-55-6663', 'MC444558866', '(555) 456-4444', 'France', 'oscar.miller@email.com'),
(15, 'Isabella', 'Johnson', '1995-02-20', '555-66-7774', 'MC555669977', '(555) 567-5555', 'Canada', 'isabella.johnson@email.com'),
(16, 'Cameron', 'Anderson', '1989-07-05', '666-77-8885', 'MC666773488', '(555) 678-6666', 'United States', 'cameron.anderson@email.com'),
(17, 'Lily', 'Brown', '1982-01-18', '777-88-9996', 'MC777889912', '(555) 789-7777', 'United Kingdom', 'lily.brown@email.com'),
(18, 'Noah', 'Miller', '1998-05-30', '888-99-0007', 'MC888990330', '(555) 890-8888', 'France', 'noah.miller@email.com'),
(19, 'Aiden', 'Smith', '1975-08-10', '999-00-1118', 'MC999001551', '(555) 901-9999', 'Australia', 'aiden.smith@email.com'),
(20, 'Ella', 'Davis', '1987-12-18', '000-11-2229', 'MC000112266', '(555) 112-0000', 'Canada', 'ella.davis@email.com'),
(38, 'Ben', 'McDonalds', '2001-12-18', '000-11-2212', 'MC000117564', '(555) 112-1234', 'Canada', 'ben.mcdonalds@email.com');


INSERT INTO PersonResidences (PersonID, ResidenceID) VALUES
(11, 1),
(12, 2),
(13, 11),
(14, 4),
(15, 11),
(16, 6),
(17, 7),
(18, 8),
(19, 9),
(20, 10),
(38, 26);

# Other non-administrative Personnel
INSERT INTO Persons (PersonID, FirstName, LastName, DateOfBirth, SocialSecurityNumber, MedicareCardNumber, TelephoneNumber, Citizenship, EmailAddress) VALUES
(21, 'Evelyn', 'Reyes', '1982-03-10', '111-12-3333', 'MC111223311', '(555) 123-1111', 'Canada', 'evelyn.reyes@email.com'),
(22, 'Carter', 'Williams', '1985-06-25', '212-33-4444', 'MC222345412', '(555) 234-2222', 'United States', 'carter.williams@email.com'),
(23, 'Zara', 'Lopez', '1990-09-08', '333-43-5555', 'MC333445513', '(555) 345-3333', 'United Kingdom', 'zara.lopez@email.com'),
(24, 'Omar', 'Smith', '1978-11-15', '444-54-6666', 'MC444556614', '(555) 456-4444', 'France', 'omar.smith@email.com'),
(25, 'Mila', 'Perez', '1995-02-20', '555-65-7777', 'MC555667715', '(555) 567-5555', 'Canada', 'mila.perez@email.com'),
(26, 'Levi', 'Garcia', '1989-07-05', '666-77-8888', 'MC666778816', '(555) 678-6666', 'United States', 'levi.garcia@email.com'),
(27, 'Isabel', 'Wright', '1982-01-18', '772-88-9999', 'MC777889917', '(555) 789-7777', 'United Kingdom', 'isabel.wright@email.com'),
(28, 'Owen', 'Martinez', '1998-05-30', '882-99-0000', 'MC888990018', '(555) 890-8888', 'France', 'owen.martinez@email.com'),
(29, 'Nina', 'Cooper', '1975-08-10', '994-00-1111', 'MC999001119', '(555) 901-9999', 'Australia', 'nina.cooper@email.com'),
(30, 'Elijah', 'Fisher', '1987-12-18', '005-11-2222', 'MC0001122255', '(555) 112-0000', 'Canada', 'elijah.fisher@email.com'),
(31, 'Ivy', 'Ramirez', '1985-07-20', '111-26-3333', 'MC111223399', '(555) 555-5555', 'Canada', 'ivy.ramirez@email.com'),
(32, 'Hudson', 'Barnes', '1990-09-12', '226-33-4444', 'MC222376412', '(555) 666-6666', 'United States', 'hudson.barnes@email.com'),
(33, 'Zoe', 'Diaz', '1982-04-03', '337-44-5555', 'MC333445566', '(555) 777-7777', 'United Kingdom', 'zoe.diaz@email.com'),
(34, 'Felix', 'Turner', '1998-12-28', '448-55-6666', 'MC444556686', '(555) 888-8888', 'France', 'felix.turner@email.com'),
(35, 'Stella', 'Murray', '1995-02-20', '559-66-7777', 'MC555667763', '(555) 999-9999', 'Canada', 'stella.murray@email.com'),
(36, 'Jared', 'McDonalds', '1991-02-21', '559-66-1234', 'MC555660983', '(555) 999-1111', 'Canada', 'jared.mcdonalds@email.com'),
(37, 'Makayla', 'McDonalds', '1992-02-21', '559-66-2222', 'MC574360983', '(555) 999-2222', 'Canada', 'makayla.mcdonalds@email.com');

INSERT INTO PersonResidences (PersonID, ResidenceID) VALUES
(21, 11),
(22, 12),
(23, 13),
(24, 14),
(25, 15),
(26, 16),
(27, 17),
(28, 18),
(29, 19),
(30, 20),
(31, 21),
(32, 22),
(33, 23),
(34, 24),
(35, 25),
(36, 26),
(37, 25);



# Administrative Personnel
INSERT INTO Employees VALUES
(1, 1, 'Administrator', 1),
(2, 2, 'Administrator', 2),
(3, 3, 'Administrator', 3),
(4, 4, 'Administrator', 4),
(5, 5, 'Administrator', 5),
(6, 6, 'Administrator', 6),
(7, 7, 'Administrator', 7),
(8, 8, 'Administrator', 8),
(9, 9, 'Administrator', 9),
(10, 10, 'Administrator', 10),
(29, 39, 'Administrator', 10);


# Non Administrative Personnel
INSERT INTO Employees VALUES
(11, 21, 'Nurse', 1),
(12, 22, 'Doctor', 2),
(13, 23, 'Cashier', 3),
(14, 24, 'Pharmacist', 4),
(15, 25, 'Receptionist', 5),
(16, 26, 'Security Personnel', 6),
(17, 27, 'Regular Employee', 7),
(18, 28, 'Nurse', 8),
(19, 29, 'Doctor', 9),
(20, 30, 'Cashier', 10),
(21, 31, 'Pharmacist', 1),
(22, 32, 'Receptionist', 2),
(23, 33, 'Security Personnel', 3),
(24, 34, 'Regular Employee', 4),
(25, 35, 'Nurse', 5),
(26, 36, 'Regular Employee', 1),
(27, 37, 'Pharmacist', 1),
(28, 38, 'Pharmacist', 1),
(60, 21, 'Pharmacist', 2);


# Relationships between Employees and Persons living in the same residence
INSERT INTO EmployeePersonRelationship VALUES
(1, 1, 11, 'Roommate'),
(2, 2, 12, 'Partner'),
(3, 3, 13, 'Parent'),
(4, 4, 14, 'Dependent'),
(5, 5, 15, 'Roommate'),
(6, 6, 16, 'Partner'),
(7, 7, 17, 'Parent'),
(8, 8, 18, 'Dependent'),
(9, 9, 19, 'Roommate'),
(10, 26, 37, 'Partner'),
(11, 27, 36, 'Partner'),
(12, 26, 38, 'Parent'),
(13, 27, 38, 'Parent'),
(14, 28, 36, 'Dependent'),
(15, 28, 37, 'Dependent');


INSERT INTO Facilities (FacilityID, Name, Address, City, Province, PostalCode,PhoneNumber,
WebAddress, Type, Capacity, GeneralManagerID)
VALUES
(1,'Hospital Maisonneuve Rosemont','5415 Assomption Blvd','Montreal','Quebec','H1T
2M4','(514)
252-3400','https://ciusss-estmtl.gouv.qc.ca/etablissement/hopital-maisonneuve-rosemont','Hospi
tal',500,1),
(2,'Medical Clinic Laval','1811 Boulevard des Laurentides','Laval','Quebec','H7M 2P7','(514)
731-045','https://muhc.ca/montreal-general-hospital','Clinic',10,2),
(3,'Centre de suivi de L''Île de Montréal','303A Av. Dorval','Dorval','Quebec','H9S 3H6','(514)
208-916','https://muhc.ca/Île-de-Montréal-clinic','Clinic',15,3),
(4,'Hôpital-Général de Québec','260 Bd Langelier','Québec City','Quebec','G1K 1H4','(418)
529-0931','https://www.comitedesusagersvc.com/etablissements/chsld-hopital-general-de-queb
ec/','Hospital',400,4),
(5,'CLSC de Montréal-Nord','11441 Bd Lacordaire','Montréal-Nord','Quebec','H1G 4J9','(514)
384-2000','https://www.ciusssnordmtl.ca/installations/clsc/clsc-de-montreal-nord/','CLSC',25,5),
(6,'CLSC de Cote de Neiges','5700 Chem. de la Côte-des-Neiges','Montreal','Quebec','H3T
2A8','(514) 731-8531','https://www.ciussswestcentral.ca/sites-and-resources/clsc/clsc-de-cote-des-neiges/','Clinic',25,6),
(7,'Pharmacy Montreal','5815 Sherbrooke St W','Montreal','Quebec','H4A 1X4','(514)
925-061','https://muhc.ca/Pharmacy-Montreal','Pharmacy',5,7),
(8,'Pharmacy Quebec','698 Rue Saint-Jean','Québec City','Quebec','G1R 1P8','(418)
407-298','https://muhc.ca/Pharmacy-Quebec','Pharmacy',7,8),
(9,'Rehabilitation Institute Gingras-Lindsay de Montreal','6363 Chem.
Hudson','Montreal','Quebec','H3S 1M9','(514)
340-2085','https://ciusss-centresudmtl.gouv.qc.ca/etablissement/institut-de-readaptation-gingras
-lindsay-de-montreal-darlington#c44391','Special Installment',15,9),
(10,'Accès Physio Laval','950 Rue Claude-Gagné Unité 314','Laval','Quebec','H7N 5H9','(450)
687-0004','https://www.accesphysio.com/fr/rendez-vous','Special Installment',7,10),
(11,'Pharmasave Lincoln Medical Pharmacy','4413 Ontario St #102','Lincoln','Ontario','L0R
1B5','(450) 687-1111','https://pharmasave.com/lincoln/','Pharmacy',5,10);


INSERT INTO EmploymentRecord(EmployeeID,FacilityID,StartDate,EndDate) VALUES
(1,10,'2014-01-15','2018-01-30'),
(1,5,'2018-04-15','2022-01-30'),
(1,1,'2022-02-15',null),
(2,3,'2014-08-22','2018-04-20'),
(2,2,'2018-05-10',null),
(3,2,'2016-05-10','2018-01-15'),
(3,1,'2018-02-14','2021-12-14'),
(3,3,'2022-02-22',null),
(4,5,'2015-12-01','2017-12-25'),
(4,4,'2018-01-17',null),
(5,5,'2021-01-01',null),
(6,7,'2017-07-12','2018-06-19'),
(6,3,'2018-05-10','2022-01-20'),
(6,6,'2022-02-10',null),
(7,7,'2019-07-12',null),
(8,8,'2020-04-28',null),
(9,9,'2021-01-20',null),
(10,1,'2015-03-15','2018-01-30'),
(10,10,'2018-02-14',null),
(11,8,'2017-01-08','2018-02-15'),
(11,1,'2018-03-08',null),
(12,5,'2016-04-12','2017-05-18'),
(12,2,'2017-06-25',null),
(13,2,'2018-09-10','2019-10-25'),
(13,3,'2019-11-30',null),
(14,9,'2019-06-05','2020-07-10'),
(14,4,'2020-08-15',null),
(15,4,'2017-08-20','2018-11-30'),
(15,5,'2018-01-10',null),
(16,10,'2020-01-15','2021-02-20'),
(16,6,'2021-04-02',null),
(17,1,'2016-11-03','2017-12-10'),
(17,7,'2017-09-22',null),
(18,3,'2018-03-22','2019-04-28'),
(18,8,'2019-10-12',null),
(19,7,'2019-01-18','2020-02-25'),
(19,9,'2020-11-05',null),
(20,6,'2017-04-30','2018-06-10'),
(20,10,'2018-02-28',null),
(21,1,'2017-05-15',null),
(22,2,'2019-08-20',null),
(23,3,'2020-10-01',null),
(24,4,'2018-11-12',null),
(25,5,'2021-01-22',null),
(26,1,'2021-01-22',null),
(27,1,'2021-01-22',null),
(28, 2, '2023-06-19', null),
(29,11,'2022-01-22',null),
(60, 2, '2023-01-23', NULL);


INSERT INTO Vaccines VALUES
(1, 11, 10, 'Pfizer', '2020-04-27', 1),
(2, 12, 9, 'Moderna', '2020-01-13', 1),
(3, 15, 8, 'AstraZeneca', '2021-07-18', 1),
(4, 17, 7, 'Johnson & Johnson', '2021-12-29', 1),
(5, 18, 6, 'Pfizer', '2020-08-05', 1),
(6, 21, 5, 'Moderna', '2021-02-06', 1),
(7, 24, 4, 'AstraZeneca', '2023-01-01', 1),
(8, 25, 3, 'Johnson & Johnson', '2020-06-11', 1),
(9, 29, 2, 'Pfizer', '2023-11-15', 1),
(10, 32, 1, 'Moderna', '2021-03-30', 1),
(11, 12, 4, 'Pfizer', '2020-03-26', 2),
(12, 17, 9, 'Johnson & Johnson', '2022-01-23', 2),
(13, 21, 5, 'Pfizer', '2021-04-29', 2),
(14, 25, 6, 'Moderna', '2020-08-02', 2),
(15, 32, 1, 'Moderna', '2021-07-01', 2);

INSERT INTO Infections (InfectionID, PersonID, InfectionDate, InfectionEndDate, InfectionType) VALUES
(1, 11, '2020-03-21', '2020-04-10', 'COVID-19'),
(2, 15, '2021-06-01', '2021-06-21', 'SARS-CoV-2 Variant'),
(3, 21, '2021-01-29', '2021-02-18', 'COVID-19'),
(4, 29, '2023-10-13', NULL, 'Other'),
(5, 32, '2021-03-12', '2021-04-01', 'COVID-19'),
(6, 13, '2022-04-25', NULL, 'SARS-CoV-2 Variant'),
(7, 16, '2023-01-09', '2023-01-29', 'Other'),
(8, 23, '2022-11-02', NULL, 'COVID-19'),
(9, 27, '2022-08-07', '2022-08-27', 'COVID-19'),
(10, 30, '2020-12-12', NULL, 'SARS-CoV-2 Variant'),
(11, 36, '2024-02-16', '2024-03-08', 'COVID-19'),
(12, 11, '2021-07-05', '2021-07-25', 'Alpha Variant'),
(13, 11, '2022-08-15', NULL, 'Beta Variant'),
(14, 15, '2021-09-25', '2021-10-15', 'Gamma Variant'),
(15, 21, '2021-10-30', NULL, 'Delta Variant'),
(16, 21, '2023-12-05', '2023-12-25', 'Omicron Variant'),
(17, 29, '2021-07-10', NULL, 'Delta Variant'),
(18, 29, '2023-08-20', NULL, 'Gamma Variant'),
(19, 29, '2022-09-30', '2022-10-20', 'Beta Variant'),
(20, 32, '2021-11-05', NULL, 'Alpha Variant'),
(21, 32, '2023-12-15', '2024-01-04', 'Delta Variant'),
(22, 39, '2024-02-15', NULL, 'COVID-19'),
(23, 37, '2024-02-16', NULL, 'COVID-19'),
(24, 38, '2024-01-22', NULL, 'COVID-19'),
(50, 21, '2024-03-23', NULL, 'COVID-19');


INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime) VALUES (1, 1, '2023-04-20', '9:00', '17:00'),
(2, 2, '2023-04-20', '9:00', '17:00'),
(3, 3, '2023-04-20', '9:00', '17:00'),
(4, 4, '2023-04-20', '9:00', '17:00'),
(5, 5, '2023-04-20', '9:00', '17:00'),
(6, 6, '2023-04-20', '9:00', '17:00'),
(7, 7, '2023-04-20', '9:00', '17:00'),
(8, 8, '2023-04-20', '9:00', '17:00'),
(9, 9, '2023-04-20', '9:00', '17:00'),
(10, 10, '2023-04-20', '9:00', '17:00'),
(11, 1, '2023-04-20', '9:00', '17:00'),
(12, 2, '2023-04-20', '9:00', '17:00'),
(13, 3, '2023-04-20', '9:00', '17:00'),
(14, 4, '2023-04-20', '9:00', '17:00'),
(15, 5, '2023-04-20', '9:00', '17:00'),
(16, 6, '2023-04-20', '9:00', '17:00'),
(17, 7, '2023-04-20', '9:00', '17:00'),
(18, 8, '2023-04-20', '9:00', '17:00'),
(19, 9, '2023-04-20', '9:00', '17:00'),
(20, 10, '2023-04-20', '9:00', '17:00'),
(21, 1, '2023-04-20', '9:00', '17:00'),
(22, 2, '2023-04-20', '9:00', '17:00'),
(23, 3, '2023-04-20', '9:00', '17:00'),
(24, 4, '2023-04-20', '9:00', '17:00'),
(25, 5, '2023-04-20', '9:00', '17:00'),
(26, 1, '2023-04-20', '9:00', '17:00'),
(27, 1, '2023-04-20', '9:00', '17:00'),
(28, 2, '2023-04-20', '9:00', '17:00'),
(29, 11, '2023-04-20', '9:00', '15:00');

INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime) VALUES (1,1,"2024-04-02", "6:00", "17:00");
INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime) VALUES (11, 1, '2024-04-15', '9:00', '17:00');
INSERT INTO Schedules (EmployeeID, FacilityID, Date, StartTime, EndTime) VALUES (11, 1, '2024-04-16', '9:35', '17:45');


SET FOREIGN_KEY_CHECKS = 1;
