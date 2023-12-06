const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Login API
app.post("/login", async (req, res) => {
  const { userEmail, userPw, autoLogin } = req.body;
  let query = "SELECT * FROM user WHERE user_email = ? AND user_pw = ?";

  connection.query(query, [userEmail, userPw], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Server Error");
    }

    if (results.length > 0) {
      const userExists = true;
      const userNickname = results[0].user_nickname || null;
      const managementSpaceId = results[0].management_space_id || null;

      console.log("autoLogin: ", autoLogin);
      console.log("AutoLogin: ", typeof autoLogin);

      if (autoLogin == true) {
        // 자동로그인 체크
        if (userNickname != null) {
          //user_nickname 값 있으면 session 생성
          const autoLoginResponse = await callAutoLoginAPI(userEmail);
          const { sessionID } = autoLoginResponse;

          return res.json({
            userEmail,
            userNickname,
            managementSpaceId,
            sessionID: sessionID,
          });
        } else {
          sessionID = null;

          return res.json({
            userEmail,
            userNickname,
            managementSpaceId,
            sessionID,
          });
        }
      } else {
        res.json({
          userEmail,
          userNickname,
          managementSpaceId,
        });
      }
    } else {
      const userExists = false;
      return res.json({ userExists });
    }
  });
});

async function callAutoLoginAPI(userEmail) {
  const autoLoginEndpoint = process.env.ENDPOINT;

  try {
    // HTTP 요청
    const response = await axios.post(autoLoginEndpoint, {
      userEmail,
    });

    // HTTP 응답에서 세션ID 추출
    const sessionID = response.data.sessionID;

    return {
      sessionID,
    };
  } catch (error) {
    console.error("Error sending HTTP request:", error);
    return {
      success: false,
      sessionID: null,
    };
  }
}

module.exports = {
  login: serverless(app),
};
