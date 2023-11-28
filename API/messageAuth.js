const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const coolsms = require("coolsms-node-sdk").default;
const serverless = require("serverless-http");
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

const connection = mysql.createPool(rdsConfig);

// COOLSMS
const accountKey = process.env.COOLSMS_ACCOUNT_KEY;
const accountSecret = process.env.COOLSMS_ACCOUNT_SECRET;
const messageService = new coolsms(accountKey, accountSecret);

app.post("/messageAuth", async (req, res) => {
  try {
    const { userPhoneNum } = req.body;

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();

    let sendSuccess = false;

    try {
      // COOLSMS를 사용하여 SMS로 전송
      await messageService
        .sendOne({
          to: userPhoneNum,
          from: process.env.COOLSMS_NUMBER,
          text: `[인증번호: ${authCode}]`,
        })
        .then((response) => {
          console.log(response);
          sendSuccess = true;
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("SMS sending failed:", error);
    }

    if (sendSuccess) {
      // SMS 전송 성공 시 데이터베이스에 추가
      connection.query(
        "INSERT INTO message_auth (userPhoneNum, authCode) VALUES (?, ?) ON DUPLICATE KEY UPDATE authCode = ?",
        [userPhoneNum, authCode, authCode],
        (dbErr, result) => {
          if (dbErr) {
            console.error("Database insert/update error:", dbErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Record inserted/updated in message_auth table");
            res.json({ sendSuccess });
          }
        }
      );
    } else {
      res.json({ sendSuccess });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  messageAuth: serverless(app),
};

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
