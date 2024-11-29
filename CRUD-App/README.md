# CRUD-App
SVG Source: https://www.svgrepo.com/collection/dazzle-line-icons/?search=pen

MAP: Open Street Map with Nominatim

## Overview
This is a small project to practice the combination of a MySQL Database with a React Frontend.
The design approach is a study in Neumorphism. This tool was used as a guideline to make elements appear more 3D: https://neumorphism.io/

## Technologies
- React
- MySQL

## Installation
1. clone the repository
2. navigate to the project folder cd CRUD-App
3. install dependencies: npm install
4. start the application: npm start

## Database Structure

This project uses a MySQL database to store and manage data related to **Organisations**, **Locations**, and **Contacts**. Below is an overview of the tables, their columns, and relationships.

### 1. **Organisation Table**
The `organisation` table stores information about various organisations, including their associated location and contact information.

| Column             | Type         | Description                                                                                              |
|--------------------|--------------|----------------------------------------------------------------------------------------------------------|
| `organisationID`   | INT          | Primary Key. Unique identifier for each organisation.                                                    |
| `locationID`       | INT          | Foreign Key. References `location.locationID`. Represents the location of the organisation.              |
| `contactID`        | INT          | Foreign Key. References `contact.contactID`. Represents the primary contact person for the organisation. |
| `organisationTitle`| VARCHAR(100) | Name of the organisation.                                                                                |
| `organisationType` | VARCHAR(100) | Type of the organisation (Education or Corporation).                                                     |
| `organisationWebsite` | VARCHAR(100) | Website URL for the organisation.                                                                        |
| `organisationLogo` | VARCHAR(45)  | File path for the organisation's logo.                                                                   |

### 2. **Location Table**
The `location` table contains address and geographic information for the organisation's physical location.

| Column            | Type         | Description                                      |
|-------------------|--------------|--------------------------------------------------|
| `locationID`      | INT          | Primary Key. Unique identifier for each location. |
| `locationTitle`   | VARCHAR(100) | Title or name of the location (e.g., "Headquarters"). |
| `street`          | VARCHAR(100) | Street address of the location.                 |
| `zip`             | VARCHAR(30)  | Postal code for the location.                   |
| `city`            | VARCHAR(100) | City where the location is situated.            |
| `country`         | VARCHAR(100) | Country where the location is located.          |

### 3. **Contact Table**
The `contact` table stores information about the contact persons associated with the organisations. Each contact is linked to a specific location.

| Column             | Type         | Description                                                                                        |
|--------------------|--------------|----------------------------------------------------------------------------------------------------|
| `contactID`        | INT          | Primary Key. Unique identifier for each contact.                                                   |
| `locationID`       | INT          | Foreign Key. References `location.locationID`. Represents the location where the contact is based. |
| `firstname`        | VARCHAR(100) | First name of the contact person.                                                                  |
| `lastname`         | VARCHAR(100) | Last name of the contact person.                                                                   |
| `mail`             | VARCHAR(100) | Email address of the contact person.                                                               |
| `phone`            | VARCHAR(30)  | Phone number of the contact person.                                                                |
| `contactType`      | VARCHAR(45)  | Type of contact (Person, Organisation).                                                            |

---

### Relationships

- **Organisation to Location**: Each organisation is associated with a single location. The `locationID` in the `organisation` table is a foreign key referencing the `locationID` in the `location` table.
- **Organisation to Contact**: Each organisation has a primary contact person. The `contactID` in the `organisation` table is a foreign key referencing the `contactID` in the `contact` table.
- **Contact to Location**: A contact is tied to a specific location. The `locationID` in the `contact` table is a foreign key referencing the `locationID` in the `location` table.
