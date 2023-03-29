// ------------- Imports ----------------
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db-connector");
const asyncHandler = require("express-async-handler");

// ------------------ Setup -----------------
const PORT = 3288;
const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: true }));

// ------------------ Helper Functions --------------------------

// Send SQL line and return a response
const sendSQL = function (sql, res) {
  db.pool.query(sql, (error, results) => {
    console.log(sql);
    if (error) {
      console.log(error.sqlMessage);
      res.status(400).send(error.message);
    } else {
      res.status(200).send(results);
    }
  });
};

// -------------------------------------- Customers ------------------------------------------------

// Get All Customer Info
app.get("/customers", (req, res) => {
  const customer_id = req.query["customer_id"];
  if (customer_id) {
    const sql = `SELECT * FROM Customers WHERE customer_id=${customer_id}`;
    sendSQL(sql, res);
  } else {
    const sql = "SELECT * FROM Customers;";
    sendSQL(sql, res);
  }
});

// Get customer info based on search phrase
app.get(
  "/customers/search/:search_phrase",
  asyncHandler(async (req, res) => {
    searchPhrase = req.params.search_phrase;
    const sql = `SELECT * FROM Customers WHERE customer_id LIKE "%${searchPhrase}%" OR f_name LIKE "%${searchPhrase}%" OR l_name LIKE "%${searchPhrase}%" \
OR email LIKE "%${searchPhrase}%" OR phone LIKE "%${searchPhrase}%" \
OR address LIKE "%${searchPhrase}%"`;
    sendSQL(sql, res);
  })
);

// Insert Customer Info
app.post("/customers", (req, res) => {
  const { f_name, l_name, email, phone, address } = req.body;
  const sql = `INSERT INTO Customers (f_name, l_name, email, phone, address) VALUES ("${f_name}", "${l_name}", "${email}", "${phone}", "${address}");`;
  sendSQL(sql, res);
});

// Update Customer Info
app.put("/customers/:customer_id", (req, res) => {
  const customer_id = req.params.customer_id;
  const { f_name, l_name, email, phone, address } = req.body;
  const sql = `UPDATE Customers SET f_name="${f_name}", l_name="${l_name}", email="${email}", phone="${phone}", address="${address}" WHERE customer_id=${customer_id};`;
  sendSQL(sql, res);
});

// Delete Customer Info
app.delete("/customers/:customer_id", (req, res) => {
  const customer_id = req.params.customer_id;
  const sql = `DELETE FROM Customers WHERE customer_id=${customer_id};`;
  sendSQL(sql, res);
});

// --------------------------------------- Invoices -----------------------------------------------

// Get Invoice Data
app.get("/invoices", (req, res) => {
  const sql = "SELECT * FROM Invoices;";
  sendSQL(sql, res);
});

// Get Customer names for Invoice Drop Down
app.get("/invoices/customers", (req, res) => {
  const sql =
    "SELECT customer_id, CONCAT(f_name, ' ', l_name) AS full_name FROM Customers;";
  sendSQL(sql, res);
});

// Create new invoice
app.post("/invoices", (req, res) => {
  const { payment_terms, customer_id, total_amount, invoice_date } = req.body;
  const sql = `INSERT INTO Invoices (payment_terms, customer_id, total_amount, invoice_date) \
VALUES ("${payment_terms}", ${customer_id}, ${total_amount}, "${invoice_date}");`;
  sendSQL(sql, res);
});

// ------------------------------ Sales -------------------------------------

// Get Sales Info
app.get("/sales", (req, res) => {
  const sql = `SELECT * FROM Sales;`;
  sendSQL(sql, res);
});

// ---DropDown Menus---

// Get Invoice Info Dropdown
app.get("/sales/invoices", (req, res) => {
  const sql =
    "SELECT invoice_id, CONCAT('Invoice #', invoice_id) AS invoice_name FROM Invoices;";
  sendSQL(sql, res);
});

// Get Robot Info Dropdown
app.get("/sales/robots", (req, res) => {
  const sql =
    "SELECT robot_id, CONCAT('Robot #', robot_id) AS robot_name FROM Robots;";
  sendSQL(sql, res);
});

// Get Software Info Dropdown
app.get("/sales/software", (req, res) => {
  const sql = "SELECT software_id, description FROM Software_Features;";
  sendSQL(sql, res);
});

// Create New Sales Row
app.post("/sales", (req, res) => {
  const { invoice_id, robot_id, software_id } = req.body;
  const sql = `INSERT INTO Sales(invoice_id, robot_id, software_id) VALUES (${invoice_id}, ${robot_id}, ${software_id});`;
  sendSQL(sql, res);
});

// --------------------------- Robots -----------------------------------------

// Get Robot Info
app.get("/robots", (req, res) => {
  const sql = `SELECT Robots.robot_id, Robots.cost, Robots.manufactured_date, GROUP_CONCAT(Software_Features.description SEPARATOR', ') AS software_packages, GROUP_CONCAT(Software_Features.software_id) as software_ids, Robots.status
    FROM Robots
    LEFT OUTER JOIN Robot_Has_Software_Features ON Robots.robot_id = Robot_Has_Software_Features.robot_id
    LEFT OUTER JOIN Software_Features ON Robot_Has_Software_Features.software_id = Software_Features.software_id
    GROUP BY (Robots.robot_id)
    ORDER BY Robots.robot_id`;
  sendSQL(sql, res);
});

// Make new Robot
app.post("/robots", (req, res) => {
  const { cost, manufactured_date, software, status } = req.body;
  const sql = `INSERT INTO Robots (cost, manufactured_date, status) VALUES (${cost}, "${manufactured_date}", ${status});`;
  // console.log(sql);
  db.pool.query(sql, (error, results, fields) => {
    const robot_id = results["insertId"];
    for (let i = 0; i < software.length; i++) {
      addRobotHasSoftware(software[i], robot_id, res);
    }
  });
  res.sendStatus(200);
});

// Edit Robot
app.put("/robots/:robot_id", (req, res) => {
  const robot_id = req.params.robot_id;
  const { cost, manufactured_date, status, software } = req.body;
  const sql = `UPDATE Robots SET cost=${cost}, manufactured_date="${manufactured_date}", status=${status} WHERE robot_id=${robot_id}`;
  const softwareSQL = `SELECT software_id FROM Robot_Has_Software_Features WHERE robot_id=${robot_id};`;
  db.pool.query(sql, (updateError, updateResults) => {
    // Get software already on the robot
    db.pool.query(softwareSQL, (softwareError, softwareResults) => {
      ownedSoftware = softwareResults
        .map((software) => Object.values(software))
        .flat();
      // Loop through the software the robot already has and check to see if it is in the requested software, remove them if not
      for (let i = 0; i < ownedSoftware.length; i++) {
        if (!software.includes(ownedSoftware[i])) {
          removeRobotHasSoftware(ownedSoftware[i], robot_id);
        }
      }
      // Loop through all software in the request and add them to
      for (let i = 0; i < software.length; i++) {
        addRobotHasSoftware(software[i], robot_id, res);
      }
    });
  });
  res.sendStatus(200);
});

// Delete robot
app.delete("/robots/:robot_id", (req, res) => {
  const robot_id = req.params.robot_id;
  const sql = `DELETE FROM Robots WHERE robot_id=${robot_id};`;
  sendSQL(sql, res);
});

// --------------- Software ---------------------------------

// DELETE FROM Software_Features WHERE software_id=:software_id;

// Get all software Info
app.get("/software", (req, res) => {
  const sql = `SELECT * FROM Software_Features;`;
  sendSQL(sql, res);
});

// Create new software
app.post("/software", (req, res) => {
  const { cost, description } = req.body;
  const sql = `INSERT INTO Software_Features (cost, description) VALUES (${cost}, '${description}');`;
  sendSQL(sql, res);
});

// Edit Software
app.put("/software/:software_id", (req, res) => {
  const { cost, description } = req.body;
  const software_id = req.params.software_id;
  const sql = `UPDATE Software_Features SET cost=${cost}, description='${description}' WHERE software_id=${software_id}`;
  sendSQL(sql, res);
});

// Delete Software
app.delete("/software/:software_id", (req, res) => {
  const software_id = req.params.software_id;
  const sql = `DELETE FROM Software_Features WHERE software_id=${software_id};`;
  sendSQL(sql, res);
});

// --------------- Robot_Has_Software_Features -------------

// Create a robot has software row
const addRobotHasSoftware = function (software_id, robot_id, res) {
  const sql = `INSERT INTO Robot_Has_Software_Features (robot_id, software_id) VALUES (${robot_id}, ${software_id})`;
  db.pool.query(sql, (error, results, fields) => {
    // console.log(sql);
    if (error) {
      // res.status(400).send(error.message);
      console.log(error.message);
    }
  });
};

const removeRobotHasSoftware = function (software_id, robot_id) {
  const sql = `DELETE FROM Robot_Has_Software_Features WHERE robot_id=${robot_id} AND software_id=${software_id};`;
  db.pool.query(sql, (error, results, fields) => {
    // console.log(sql);
    if (error) {
      // res.status(400).send(error.message);
      console.log(error.message);
    }
  });
};

// --------------- Incidents ----------------------------

// Get all incidents
app.get("/incidents", (req, res) => {
  const sql = `SELECT * FROM Incidents;`;
  sendSQL(sql, res);
});

// Create new incident
app.post("/incidents", (req, res) => {
  const { description, robot_id } = req.body;
  const sql = `INSERT INTO Incidents (description, robot_id) VALUES ("${description}", ${robot_id});`;
  sendSQL(sql, res);
});

// -------------- Listening -----------------------------

// Start Server
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
