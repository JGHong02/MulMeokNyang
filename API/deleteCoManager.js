const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// DeleteComanager API
app.delete("/deleteCoManager", (req, res) => {
  const { coManagerUserEmail, managementSpaceId } = req.body;

  // user 테이블에서 coManagerUserEmail의 management_space_id 업데이트
  const updateUserQuery = `UPDATE user SET management_space_id = '' WHERE user_email = '${coManagerUserEmail}'`;
  connection.query(updateUserQuery, (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Internal server error");
    }

    // management_space 테이블에서 co_managers_user_email 정보 가져오기
    const getCoManagersQuery = `SELECT co_managers_user_email FROM management_space WHERE management_space_id = '${managementSpaceId}'`;
    connection.query(getCoManagersQuery, (err, results) => {
      if (err) {
        console.error("Error fetching co-managers:", err);
        return res.status(500).send("Internal server error");
      }
      // 로그 추가
      console.log("co_managers_user_email:", results[0].co_managers_user_email);

      let coManagersUserEmailArray = results[0].co_managers_user_email;

      if (!coManagersUserEmailArray) {
        coManagersUserEmailArray = [];
      }

      // 로그 추가
      console.log("Comanagers User Email array: ", coManagersUserEmailArray);

      const updatedCoManagers = coManagersUserEmailArray.filter(
        (email) => email !== coManagerUserEmail
      );

      console.log("Filltered Emails: ", updatedCoManagers);

      const updatedCoManagersJson = JSON.stringify(updatedCoManagers);

      const updateSpaceQuery = `UPDATE management_space SET co_managers_user_email = ? WHERE management_space_id = '${managementSpaceId}'`;
      connection.query(updateSpaceQuery, [updatedCoManagersJson], (err) => {
        if (err) {
          console.error("Error updating management space:", err);
          return res.status(500).json({ deleteSuccess: false });
        }

        res.json({ deleteSuccess: true });
      });
    });
  });
});

module.exports = {
  deleteCoManager: serverless(app),
};
