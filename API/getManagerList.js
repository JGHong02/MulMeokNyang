const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");

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

// GetManagerList API
app.get("/getManagerList", (req, res) => {
  const spaceId = req.query.managementSpaceId;

  const query = `SELECT main_manager_user_email, co_managers_user_email FROM management_space WHERE management_space_id = ? `;
  connection.query(query, [spaceId], (err, results) => {
    if (err) {
      console.error("Error querying the database:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.status(204).json({ message: "Management space not found" });
    }

    const { main_manager_user_email, co_managers_user_email } = results[0];

    res.json({
      mainManagerUserEmail: main_manager_user_email,
      coManagersUserEmail: co_managers_user_email
        ? JSON.parse(co_managers_user_email)
        : [],
    });
  });
});

module.exports = {
  getManagerList: serverless(app),
};
