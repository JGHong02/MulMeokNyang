const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

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

// LocalSignUp API
app.post("/localSignUp", (req, res) => {
  const { userEmail, userPw, userName, userPhoneNum } = req.body;

  // 유효성 검사
  if (!userEmail || !userPw || !userName || !userPhoneNum) {
    return res.status(400).json({ message: "Invalid input" });
  }

  // 사용자 정보 데이터베이스에 추가
  const query =
    "INSERT INTO user (user_email, user_pw, user_name, user_phonenum) VALUES (?, ?, ?, ?)";
  connection.query(
    query,
    [userEmail, userPw, userName, userPhoneNum],
    (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      res.json({ signUpSuccess: true });
    }
  );
});

module.exports = {
  localSignUp: serverless(app),
};
