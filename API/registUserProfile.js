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
const storage = multer.memoryStorage(); // Use memory storage for uploading to S3 directly
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
          // 닉네임이 이미 존재하면 함수 종료
          return res.json({ nicknameExists: true });
        } else {
          if (userEmail.trim() !== "") {
            // userEmail이 비어 있지 않은 경우에만 처리
            // 닉네임이 존재하지 않으면 S3에 이미지 업로드 시도
            // S3에 이미지 업로드
            const params = {
              Bucket: process.env.S3_BUCKET_NAME,
              Key: `images/${Date.now()}${path.extname(
                userProfilePhoto.originalname
              )}`,
              Body: userProfilePhoto.buffer,
              ContentType: userProfilePhoto.mimetype,
              ACL: "public-read", // 객체를 공개적으로 접근 가능하게 함
            };

            s3.upload(params, (s3Err, data) => {
              if (s3Err) {
                console.error("S3 upload Error:", s3Err);
                return res
                  .status(500)
                  .json({ message: "S3 upload Error ", error: s3Err });
              }

              // S3 객체 URL을 사용자 프로필 정보에 업데이트
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

                  // 응답에 S3 URL 포함
                  res.json({ registSuccess: true, userImageUrl });
                }
              );
            });
          } else {
            return res.status(400).json({ message: "Email Value is Empty" });
          }
        }
      }
    );
  }
);

module.exports = {
  registUserProfile: serverless(app),
};
