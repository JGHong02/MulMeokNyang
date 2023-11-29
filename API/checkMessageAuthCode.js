const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

const app = express();
app.use(cors());

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

app.get("/checkMessageAuthCode", (req, res) => {
  const { userPhoneNum, authCode } = req.query;

  const query = "SELECT * FROM message_auth WHERE userPhoneNum = ? LIMIT 1";
  connection.query(query, [userPhoneNum], (err, results) => {
    if (err) {
      console.error("Database query error: ", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.json({ authSuccess: false });
    }

    const storedAuthCode = results[0].authCode;

    if (storedAuthCode === authCode) {
      res.json({ authSuccess: true });
    } else {
      res.json({ authSuccess: false });
    }
  });
});

module.exports = {
  checkMessageAuthCode: serverless(app),
};
