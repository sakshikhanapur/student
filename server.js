const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// =========================
// HOME PAGE
// =========================
app.get("/", (req, res) => {

    const sql = "SELECT * FROM students ORDER BY id ASC";

    db.query(sql, (err, results) => {

        if (err) {
            console.log("Database Error:", err);
            return res.send("Database error");
        }

        res.render("index", {
            students: results
        });
    });
});


// =========================
// ADD STUDENT
// =========================
app.post("/add", (req, res) => {

    const { name, email, course, age } = req.body;

    const sql = `
        INSERT INTO students (name, email, course, age)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [name, email, course, age],
        (err, result) => {

            if (err) {
                console.log("Add Error:", err);
                return res.send("Error adding student");
            }

            console.log("Student added successfully");

            res.redirect("/");
        }
    );
});


// =========================
// DELETE STUDENT
// =========================
app.post("/delete/:id", (req, res) => {

    const id = req.params.id;

    const sql = "DELETE FROM students WHERE id = ?";

    db.query(
        sql,
        [id],
        (err, result) => {

            if (err) {
                console.log("Delete Error:", err);
                return res.send("Error deleting student");
            }

            console.log("Student deleted successfully");

            res.redirect("/");
        }
    );
});


// =========================
// START SERVER
// =========================
app.listen(3000, () => {

    console.log("Server running at http://localhost:3000");

});