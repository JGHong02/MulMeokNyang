const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");

app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const rdsConfig = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
};

const connection = mysql.createConnection(rdsConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Database connection established");
});

// GetManagementSpaceId API
app.get("/getManagementSpaceId", (req, res) => {
  const { userEmail } = req.query;

  const query = "SELECT management_space_id FROM user WHERE user_email = ?";
  connection.query(query, [userEmail], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err });
    }
    if (results.length > 0 && results[0].management_space_id) {
      res.json({ managementSpaceId: results[0].management_space_id });
    } else {
      res.json({ managementSpaceId: null });
    }
  });
});

module.exports = {
  getManagementSpaceId: serverless(app),
};
