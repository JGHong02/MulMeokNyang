const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
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

// Nodemailer 설정
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODE_MAIL_ACCOUNT, // Gmail 계정
    pass: process.env.NODE_MAIL_PW, // Gmail 앱 비밀번호
  },
});

app.get("/sendPw", (req, res) => {
  try {
    const { userEmail } = req.query;

    // userEmail 값으로 user table에서 record를 조회해, user_pw 값을 가져옴
    connection.query(
      "SELECT user_pw FROM user WHERE user_email = ?",
      [userEmail],
      (dbErr, results) => {
        if (dbErr) {
          console.error("Database error:", dbErr);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          if (results.length > 0) {
            const userPw = results[0].user_pw;

            // 이메일 전송 설정
            const mailOptions = {
              from: process.env.NODE_MAIL_ACCOUNT, // 발송자 이메일
              to: userEmail, // 수신자 이메일
              subject: "Your Password Recovery", // 메일 제목
              text: `Your password is: ${userPw}`, // 메일 내용
            };

            // 이메일 전송
            transporter.sendMail(mailOptions, (mailErr) => {
              if (mailErr) {
                console.error("Email sending failed:", mailErr);
                res.status(500).json({ error: "Internal Server Error" });
              } else {
                console.log("Email sent successfully");
                res.json({ sendPwSuccess: true });
              }
            });
          } else {
            res.status(204).json({ error: "User not found" });
          }
        }
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  sendPw: serverless(app),
};
