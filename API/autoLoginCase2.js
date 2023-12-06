const express = require("express");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const crypto = require("crypto");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
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

//case2 자동로그인이 설정된 사용자
app.get("/autoLoginCase2", (req, res) => {
  const sessionID = req.query.sessionID;

  // 세션 테이블에서 session_id 값이 일치하는 record의 user_email 값을 조회
  const sessionQuery = "SELECT user_email FROM session WHERE session_id = ?";

  connection.query(sessionQuery, [sessionID], (err, sessionResults) => {
    if (err) {
      console.error("Error querying session table:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (sessionResults.length === 0) {
      return res.status(204).json({ message: "Session not found" });
    }

    const userEmail = sessionResults[0].user_email;

    // user 테이블에서 user_email 값으로 조회된 spaceId를 가져옴
    const userQuery =
      "SELECT management_space_id FROM user WHERE user_email = ?";

    connection.query(userQuery, [userEmail], (err, userResults) => {
      if (err) {
        console.error("Error querying user table:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (userResults.length === 0) {
        return res.status(204).json({ message: "User not found" });
      }

      const managementSpaceId =
        userResults.length > 0 ? userResults[0].management_space_id : null;

      // 응답으로 userEmail과 managementSpaceId를 보냄
      res.json({
        userEmail: userEmail,
        managementSpaceId: managementSpaceId,
      });
    });
  });
});

module.exports = {
  autoLoginCase2: serverless(app),
};
