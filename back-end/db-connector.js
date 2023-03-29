const mysql = require("mysql");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "classmysql.engr.oregonstate.edu",
  user: "cs340_naederj",
  password: "8273",
  database: "cs340_naederj",
});

module.exports.pool = pool;
