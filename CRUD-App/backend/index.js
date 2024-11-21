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

// fetch all organisations from the database
app.get("/allOrganisations", (req, res) => {
    const q = "SELECT * FROM organisation";
    db.query(q, (err, data) => {
        if (err) {
            console.error("Database Error:", err);
            return res.json({error: err});
        } else {
            return res.json(data);
        }
    });
});

// fetch organisation by ID
app.get("/organisation/:id", (req, res) => {
    const organisationID = req.params.id;
    const q = "SELECT * FROM organisation WHERE organisationID = ?";
    db.query(q, [organisationID], (error, data) => {
        if (error) {
            console.error("Database Error:", error);
            return res.status(500).json({error: "Database could not be accessed."});
        } else {
            if (data.length === 0) {
                return res.status(404).json({ error: "Organisation not found" });
            }
            return res.json(data[0]);
        }
    });
});

// fetch organisation by Type
app.get("/organisationsByType", (req, res) => {
    const organisationType = req.query.type;
    const q = "SELECT * FROM organisation WHERE organisationType = ?";
    db.query(q, [organisationType], (error, data) => {
        if (error) {
            console.error("Database Error:", error);
            return res.status(500).json({error: "Database could not be accessed."});
        } else {
            if (data.length === 0) {
                return res.status(404).json({ error: "Organisation not found" });
            }
            return res.json(data);
        }
    });
});

// add new organisation
app.post("/organisation", (req, res) => {
    const q = "INSERT INTO organisation (locationID, contactID, organisationTitle, organisationCategory, organisationWebsite, organisationLogo) VALUES (?)";
    const values = [
        req.body.locationID,
        req.body.contactID,
        req.body.organisationTitle,
        req.body.organisationCategory,
        req.body.organisationWebsite,
        req.body.organisationLogo,
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.json({error: err});
        } else {
            return res.json({message: "New entry has been added", data});
        }
    });
});

// delete organisation
app.delete("/organisation/:id", (req, res) => {
    const organisationID = req.params.id;
    const query = "DELETE FROM organisation WHERE organisationID = ?";
    db.query(query, [organisationID], (err, data) => {
        if (err) {
            return res.status(500).json({error: "Database could not be accessed."});
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({error: "Organisation not found in the database."});
        }
        res.status(200).json({message: "Organisation has been deleted."});
    });
});

// edit organisation
app.put("/organisation/:id", (req, res) => {
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

    console.log("Executing query:", query);
    console.log("Values:", values);

    db.query(query, [...values, organisationID], (err) => {
        if (err) {
            return res.status(500).json({error: "Database could not be accessed."});
        } else {
            return res.status(200).json({message: "Organisation has been edited."});
        }
    });
});

// start the server
app.listen(port, () => {
    console.log("Backend server is running on port " + port);
});
