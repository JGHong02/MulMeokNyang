const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
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

const s3 = new AWS.S3();

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// RegistUserProfile API
app.post(
  "/registUserProfile",
  upload.single("userProfilePhoto"),
  (req, res) => {
    const { userEmail, userNickname, userIntroduction } = req.body;
    const userProfilePhoto = req.file;

    if (!userEmail) {
      return res.status(400).json({ message: "Email Value is Empty" });
    }

    // 닉네임 중복 검사
    connection.query(
      "SELECT user_nickname FROM user WHERE user_nickname = ?",
      [userNickname],
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database Error: ", error: err });
        }

        if (results.length > 0) {
          return res.json({ nicknameExists: true });
        } else {
          // 프로필 사진이 있는 경우에만 S3에 업로드
          if (userProfilePhoto) {
            const params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `images/${Date.now()}${path.extname(
                userProfilePhoto.originalname
              )}`,
              Body: userProfilePhoto.buffer,
              ContentType: userProfilePhoto.mimetype,
              ACL: "public-read",
            };
            console.log("req file: ", userProfilePhoto);
            console.log(
              "userProfilePhoto.originalName: ",
              userProfilePhoto.originalname
            );
            console.log("userProfilePhoto.buffer: ", userProfilePhoto.buffer);
            console.log(
              "userProfilePhoto.mimetype: ",
              userProfilePhoto.mimetype
            );

            s3.upload(params, (s3Err, data) => {
              if (s3Err) {
                console.error("S3 upload Error:", s3Err);
                return res
                  .status(500)
                  .json({ message: "S3 upload Error ", error: s3Err });
              }

              const userImageUrl = data.Location;

              connection.query(
                "UPDATE user SET user_profile_photo = ?, user_nickname = ?, user_Introduction = ? WHERE user_email = ?",
                [userImageUrl, userNickname, userIntroduction, userEmail],
                (dbErr, result) => {
                  if (dbErr) {
                    return res
                      .status(500)
                      .json({ message: "Database Error: ", error: dbErr });
                  }
                  res.json({ registSuccess: true });
                }
              );
            });
          } else {
            // 프로필 사진이 없는 경우 DB 업데이트
            connection.query(
              "UPDATE user SET user_profile_photo = NULL, user_nickname = ?, user_Introduction = ? WHERE user_email = ?",
              [userNickname, userIntroduction, userEmail],
              (dbErr, result) => {
                if (dbErr) {
                  return res
                    .status(500)
                    .json({ message: "Database Error: ", error: dbErr });
                }
                res.json({ registSuccess: true });
              }
            );
          }
        }
      }
    );
  }
);

module.exports = {
  registUserProfile: serverless(app),
};
