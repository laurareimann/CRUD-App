import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();

const port = 8800;

// set up database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'r00t_test',
    database: 'professionalBackground'
});

app.use(express.json());
app.use(cors());

// check the server status
app.get("/", (req, res) => {
    res.json("This is the backend");
});

// get Organisations with Locations
app.get("/organisationsWithLocations", async (req, res) => {
    try {
        const [rows] = await db.promise().query(`
            SELECT o.*,
                   l.locationID AS location_locationID,
                   l.googlePlacesID,
                   l.locationTitle,
                   l.street,
                   l.zip,
                   l.city,
                   l.country
            FROM organisation o
                     LEFT JOIN location l
                               ON o.locationID = l.locationID
        `);
        res.json(rows);
    } catch (error) {
        console.error("Error fetching organisations with locations: ", error);
        res.status(500).json({
            error: "An error occurred while fetching the data.",
            message: error.message,
            stack: error.stack
        });
    }
});

// get all Locations
app.get("/allLocations", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM location");
        res.json(rows);
    } catch (error) {
        console.error("Database error: ", error);
        res.status(500).json({ error: 'An error occurred while fetching locations' });
    }
});

// fetch all organisations from the database
app.get("/allOrganisations", async (req, res) => {
    try {
        const [rows] = await db.promise().query("SELECT * FROM organisation");
        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "An error occurred while fetching organisations." });
    }
});

// fetch organisation by ID
app.get("/organisation/:id", async (req, res) => {
    const organisationID = req.params.id;
    try {
        const [rows] = await db.promise().query("SELECT * FROM organisation WHERE organisationID = ?", [organisationID]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Organisation not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database could not be accessed." });
    }
});

// fetch organisation by Type
app.get("/organisationsByType", async (req, res) => {
    const organisationType = req.query.type;
    try {
        const [rows] = await db.promise().query("SELECT * FROM organisation WHERE organisationType = ?", [organisationType]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Organisation not found" });
        }
        res.json(rows);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database could not be accessed." });
    }
});

// add new organisation
app.post("/organisation", async (req, res) => {
    const query = "INSERT INTO organisation (locationID, contactID, organisationTitle, organisationCategory, organisationWebsite, organisationLogo) VALUES (?)";
    const values = [
        req.body.locationID,
        req.body.contactID,
        req.body.organisationTitle,
        req.body.organisationCategory,
        req.body.organisationWebsite,
        req.body.organisationLogo,
    ];
    try {
        const [result] = await db.promise().query(query, [values]);
        res.json({ message: "New entry has been added", data: result });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "An error occurred while adding the organisation." });
    }
});

// delete organisation
app.delete("/organisation/:id", async (req, res) => {
    const organisationID = req.params.id;
    try {
        const [result] = await db.promise().query("DELETE FROM organisation WHERE organisationID = ?", [organisationID]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Organisation not found in the database." });
        }
        res.status(200).json({ message: "Organisation has been deleted." });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database could not be accessed." });
    }
});

// edit organisation
app.put("/organisation/:id", async (req, res) => {
    const organisationID = req.params.id;
    const query = "UPDATE organisation SET `locationID` = ?, `contactID` = ?, `organisationTitle` = ?, `organisationCategory` = ?, `organisationWebsite` = ?, `organisationLogo` = ? WHERE organisationID = ?";
    const values = [
        req.body.locationID,
        req.body.contactID,
        req.body.organisationTitle,
        req.body.organisationCategory,
        req.body.organisationWebsite,
        req.body.organisationLogo,
    ];
    try {
        const [result] = await db.promise().query(query, [...values, organisationID]);
        res.status(200).json({ message: "Organisation has been edited." });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database could not be accessed." });
    }
});

// fetch location by ID
app.get("/location/:id", async (req, res) => {
    const locationID = req.params.id;
    try {
        const [rows] = await db.promise().query("SELECT * FROM location WHERE locationID = ?", [locationID]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Location not found" });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Database could not be accessed." });
    }
});

// start the server
app.listen(port, () => {
    console.log("Backend server is running on port " + port);
});
