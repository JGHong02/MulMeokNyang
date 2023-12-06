const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const path = require("path");
const AWS = require("aws-sdk");
const multer = require("multer");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const s3 = new AWS.S3();

const rdsConfig = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
};

const connection = mysql.createConnection(rdsConfig);

const storage = multer.memoryStorage(); // Use memory storage for uploading to S3 directly
const upload = multer({ storage: storage });

app.put(
  "/modifyUserProfile",
  upload.single("userProfilePhoto"),
  async (req, res) => {
    const userEmail = req.body.userEmail;
    const userNickname = req.body.userNickname;
    const userProfilePhoto = req.file;
    const userIntroduction = req.body.userIntroduction;

    // user 테이블에서 중복된 닉네임 여부 확인
    const checkDuplicateNicknameQuery = `
    SELECT COUNT(*) AS count
    FROM user
    WHERE user_nickname = ? AND user_email != ?;
  `;

    try {
      const duplicateNicknameResult = await executeQuery(
        checkDuplicateNicknameQuery,
        [userNickname, userEmail]
      );
      const nicknameExists = duplicateNicknameResult[0].count > 0;

      if (nicknameExists) {
        // Case 1: 중복되는 닉네임
        res.json({ nicknameExists: true });
      } else {
        // Case 2: 중복되지 않는 닉네임
        // user 테이블 업데이트
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `images/${Date.now()}_${userProfilePhoto.originalname}`,
          Body: userProfilePhoto.buffer,
          ContentType: userProfilePhoto.mimetype,
          ACL: "public-read",
        };

        let data;

        s3.upload(params, (s3Err, s3Data) => {
          if (s3Err) {
            console.error("S3 upload error:", s3Err);
            return res
              .status(500)
              .json({ message: "S3 upload error:", error: s3Err });
          }

          data = s3Data;

          const userProfilePhotoUrl = data.Location;

          const updateUserQuery = `
          UPDATE user
          SET user_profile_photo = ?, user_nickname = ?, user_introduction = ?
          WHERE user_email = ?;
        `;

          executeQuery(updateUserQuery, [
            userProfilePhotoUrl,
            userNickname,
            userIntroduction,
            userEmail,
          ])
            .then(() => {
              res.json({ modifySuccess: true });
            })
            .catch((error) => {
              console.error("Error updating user profile:", error);
              res.status(500).json({ error: "Internal Server Error" });
            });
        });
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

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
  modifyUserProfile: serverless(app),
};
