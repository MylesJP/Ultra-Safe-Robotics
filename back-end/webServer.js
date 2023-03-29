// Imports
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db-connector");
const asyncHandler = require("express-async-handler");

// Setup
const PORT = 3289;
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  express.static(
    "/nfs/stak/users/naederj/CS340/Step4-React/ultra-safe-robotics/build"
  )
);

app.get("/", (req, res) => {
  res.sendFile(
    "/nfs/stak/users/naederj/CS340/Step4-React/ultra-safe-robotics/build/index.html"
  );
});

// start express server on port 5000
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
