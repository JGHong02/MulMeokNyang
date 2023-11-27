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
      const { user_nickname, management_space_id } = results[0];

      if (autoLogin && user_nickname) {
        // Auto Login
        const autoLoginResponse = await callAutoLoginAPI(userEmail);

        const { sessionID } = autoLoginResponse;
        const responseData = {
          userEmail,
          userNickname: user_nickname,
          managementSpaceId: management_space_id,
          sessionID: sessionID,
        };
        return res.json(responseData);
      } else {
        res.json({
          userEmail,
          userNickname,
          managementSpaceId,
          sessionId: null,
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
