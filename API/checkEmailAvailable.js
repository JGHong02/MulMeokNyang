const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
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
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database");
});

// 이메일 사용 가능 여부 확인 API
app.get("/checkEmailAvailable", (req, res) => {
  const { userEmail } = req.query;

  // 입력된 이메일이 데이터베이스에 존재하는지 확인
  const query = "SELECT 1 FROM user WHERE user_email = ? LIMIT 1";
  connection.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const isAvailable = results.length === 0;
    res.json({ available: isAvailable });
  });
});

module.exports = {
  checkEmailAvailable: serverless(app),
};
