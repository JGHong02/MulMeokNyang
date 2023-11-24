const express = require("express");
const app = express();
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const serverless = require("serverless-http");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dotenv = require("dotenv");
dotenv.config();

// Twilio ACCOUNT
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_ACCOUNT_AUTH;
const twilioClient = new twilio(accountSid, authToken);

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

app.post("/messageAuth", async (req, res) => {
  try {
    const { userPhoneNum } = req.body;

    const formattedPhoneNum = formatPhoneNumber(userPhoneNum);

    const authCode = Math.floor(100000 + Math.random() * 900000).toString();

    let sendSuccess = false;

    try {
      // Twilio를 사용하여 SMS로 전송
      const message = await twilioClient.messages.create({
        body: `Your verification code is: ${authCode}`,
        to: formattedPhoneNum,
        from: process.env.TWILIO_NUMBER,
      });

      // Twilio가 전송한 메시지의 SID를 확인할 수 있습니다.
      console.log("Twilio Message SID:", message.sid);

      sendSuccess = true;
    } catch (error) {
      console.error("SMS sending failed:", error);
    }

    if (sendSuccess) {
      // SMS 전송 성공 시 MySQL 데이터베이스에 추가
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

const formatPhoneNumber = (userPhoneNum) => {
  const [firstPart, secondPart, thirdPart] = userPhoneNum.split("-");

  const getNumericString = (str) => (str ? str.replace(/\D/g, "") : "");

  const formattedPhoneNum = `+82${getNumericString(
    firstPart
  )}${getNumericString(secondPart)}${getNumericString(thirdPart)}`;

  return formattedPhoneNum;
};

module.exports = {
  messageAuth: serverless(app),
};
