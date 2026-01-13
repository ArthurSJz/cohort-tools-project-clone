const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Book = require("./Models/Book.model");
const PORT = 5005;

// MONGOOOOSE
mongoose
  .connect("mongodb://127.0.0.1:27017/mongoose-example-dev")
  .then(x => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch(err => console.error("Error connecting to MongoDB", err));
 
// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const students = require("./students.json");
const cohort = require("./cohorts.json")
// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(
  cors({origin: ['http://localhost:5173'],}));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});
app.get("/api/cohorts", (req, res) =>{
  res.json(cohort);
});
app.get("/api/students", (req, res) => {
  res.json(students);
});
 //books - Retrieve all books from the database
app.get("/books", (req, res) => {
  Book.find({})
    .then((books) => {
      console.log("Retrieved books ->", books);
      res.json(books);
    })
    .catch((error) => {
      console.error("Error while retrieving books ->", error);
      res.status(500).json({ error: "Failed to retrieve books" });
    });
});



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
