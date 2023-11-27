const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");

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

// UserSearch API
app.get("/userSearch", (req, res) => {
  const userNickname = req.query.userNickname;

  const query =
    'SELECT user_email, user_profile_photo, user_introduction FROM user WHERE user_nickname = ? AND management_space_id = ""';
  connection.query(query, [userNickname], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    if (results.length === 0) {
      return res.json({ searchResultExists: false });
    }

    const { user_email, user_profile_photo, user_introduction } = results[0];
    res.json({
      userEmail: user_email,
      userProfilePhoto: user_profile_photo,
      userIntroduction: user_introduction,
    });
  });
});

module.exports = {
  userSearch: serverless(app),
};
