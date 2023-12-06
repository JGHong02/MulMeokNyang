const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// Logout API
app.delete("/logout", (req, res) => {
  const { userEmail } = req.body;

  // 세션 테이블에서 사용자 세션 삭제
  const query = "DELETE FROM session WHERE user_email = ?";
  connection.query(query, [userEmail], (err, result) => {
    if (err) {
      console.error("Error executing DELETE query:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    console.log("DELETE query executed successfully");

    // 로그아웃 성공 여부 전송
    res.json({ logoutSuccess: true });
  });
});

module.exports = {
  logout: serverless(app),
};
