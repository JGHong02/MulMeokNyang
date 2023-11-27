const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const rdsConfig = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
};

const connection = mysql.createConnection(rdsConfig);

// 데이터베이스 연결
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Database connection established");
});

// DeleteComanager API 구현
app.delete("/deleteCoManager", (req, res) => {
  const userEmail = req.query.coManagerUserEmail;
  const spaceId = req.query.managementSpaceId;

  // user 테이블에서 coManagerUserEmail의 management_space_id 업데이트
  const updateUserQuery =
    "UPDATE user SET management_space_id = '' WHERE user_email = ?";
  connection.query(updateUserQuery, [userEmail], (err) => {
    if (err) {
      console.error("Error updating user:", err);
      return res.status(500).send("Internal server error");
    }

    // management_space 테이블에서 co_managers_user_email 정보 가져오기
    const getCoManagersQuery =
      "SELECT co_managers_user_email FROM management_space WHERE management_space_id = ?";
    connection.query(getCoManagersQuery, [spaceId], (err, results) => {
      if (err) {
        console.error("Error fetching co-managers:", err);
        return res.status(500).send("Internal server error");
      }

      // Check if there are results and if co_managers_user_email is defined
      if (!results || !results[0] || !results[0].co_managers_user_email) {
        console.error("co_managers_user_email not found");
        return res.status(500).send("Internal server error");
      }

      // userEmail을 제외한 새로운 co_managers_user_email 리스트 생성
      const coManagers = JSON.parse(results[0].co_managers_user_email);
      const updatedCoManagers = coManagers.filter(
        (email) => email !== userEmail
      );
      const updatedCoManagersJson = JSON.stringify(updatedCoManagers);

      // management_space 테이블 업데이트
      const updateSpaceQuery =
        "UPDATE management_space SET co_managers_user_email = ? WHERE management_space_id = ?";
      connection.query(
        updateSpaceQuery,
        [updatedCoManagersJson, spaceId],
        (err) => {
          if (err) {
            console.error("Error updating management space:", err);
            return res.status(500).send("Internal server error");
          }

          res.json({ deleteSuccess: true });
        }
      );
    });
  });
});

module.exports = {
  deleteCoManager: serverless(app),
};

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
