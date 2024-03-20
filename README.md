# ny_db_server
CIS 4301 Backend w/ Express.js and Oracle


-----------CREATE TABLES-----------

CREATE TABLE loction (
	locationID VARCHAR2(24) PRIMARY KEY,
	areaFIPS VARCHAR2(7),
	precinctCode VARCHAR2(6),
	schoolDist VARCHAR2(80),
	neighborhood VARCHAR2(12),
	borough VARCHAR2(13),
	address VARCHAR2(255),
	latLongID VARCHAR2(24) 
);


CREATE TABLE latLong (
	latLongID VARCHAR2(24) PRIMARY KEY,
	xCoordCd VARCHAR2(7) NOT NULL,
	yCoordCd VARCHAR2(6) NOT NULL,
	latitude VARCHAR2(80) NOT NULL,
	longitude VARCHAR2(12) NOT NULL,
	locationID VARCHAR2(24)
);


ALTER TABLE loction ADD CONSTRAINT FK_loctionREFlatLong
  FOREIGN KEY (latLongID) REFERENCES latLong(latLongID)
  INITIALLY DEFERRED DEFERRABLE;


ALTER TABLE latLong ADD CONSTRAINT FK_latLongREFloction
  FOREIGN KEY (locationID) REFERENCES loction(locationID)
  INITIALLY DEFERRED DEFERRABLE;


CREATE TABLE jobs (
	jobID VARCHAR2(80) PRIMARY KEY,
	industryCode VARCHAR2(6) NOT NULL,
	avgAnnualPay VARCHAR2(6) NOT NULL,
	industryTitle VARCHAR2(80),
	theYear VARCHAR2(4),
	locationID VARCHAR2(24) REFERENCES loction(locationID)
);


CREATE TABLE crimes (
	crimeID VARCHAR2(80) PRIMARY KEY,
	addrePrecinctCode VARCHAR2(4),
	offenseDesc VARCHAR2(80),
	lawCategoryCode VARCHAR2(1),
	reportDate VARCHAR2(12),
	cmplaintDate VARCHAR2(12),
	cmplaintNumber VARCHAR(12),
	locationID VARCHAR2(24) REFERENCES loction(locationID)
);
	


CREATE TABLE residence (
	residenceID VARCHAR2(255) PRIMARY KEY,
	address VARCHAR2(255) NOT NULL,
	borough VARCHAR2(13) NOT NULL,
	salePrice VARCHAR2(50) NOT NULL,
	saleDate VARCHAR2(12) NOT NULL,
	locationID VARCHAR2(24) REFERENCES loction(locationID)
);


CREATE TABLE schools (
	schoolID VARCHAR2(80) PRIMARY KEY,
	district VARCHAR2(4) NOT NULL,
	progressReportGrade VARCHAR2(4) NOT NULL,
	overallRating VARCHAR2(1) NOT NULL,
	schoolYear VARCHAR2(4),
	schoolName VARCHAR2(80) NOT NULL,
	borough VARCHAR2(13) NOT NULL,
	locationID VARCHAR2(24) REFERENCES loction(locationID)
);
