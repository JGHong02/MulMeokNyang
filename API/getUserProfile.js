const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const AWS = require("aws-sdk");

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

app.get("/getUserProfile", async (req, res) => {
  const userEmail = req.query.userEmail;

  // Step 1: user 테이블에서 데이터 조회
  const getUserDetailsQuery = `
    SELECT user_profile_photo, user_nickname, user_introduction
    FROM user
    WHERE user_email = ?;
  `;
  try {
    const userDetails = await executeQuery(getUserDetailsQuery, [userEmail]);

    if (userDetails.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userProfilePhoto = userDetails[0].user_profile_photo;
    const userNickname = userDetails[0].user_nickname;
    const userIntroduction = userDetails[0].user_introduction;

    res.json({
      userProfilePhoto,
      userNickname,
      userIntroduction,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

function executeQuery(query, values) {
  return new Promise((resolve, reject) => {
    connection.query(query, values, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getUserProfile: serverless(app),
};
