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

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

//case1 자동 로그인이 설정되지 않은 사용자
app.post("/autoLoginCase1", (req, res) => {
  const user_email = req.body.userEmail;

  if (user_email) {
    const sessionId = generateSessionId();

    // 세션 ID 업데이트 또는 새로운 세션 생성
    const query = `
            INSERT INTO session (session_id, user_email) 
            VALUES (?, ?) 
            ON DUPLICATE KEY 
            UPDATE session_id = VALUES(session_id);`;

    connection.query(query, [sessionId, user_email], (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      // 관리 공간 ID 조회
      const spaceQuery =
        "SELECT management_space_id FROM user WHERE user_email = ?";
      connection.query(spaceQuery, [user_email], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
        const managementSpaceId =
          results.length > 0 ? results[0].management_space_id : null;
        // 세션 ID와 관리 공간 ID만 반환
        res.json({ managementSpaceId, sessionID: sessionId });
      });
    });
  } else {
    res.status(400).json({ error: "Invalid request" });
  }
});

module.exports = {
  autoLoginCase1: serverless(app),
};
