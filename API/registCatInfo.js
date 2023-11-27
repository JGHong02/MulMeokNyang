const express = require("express");
const app = express();
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

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

app.post("/registCatInfo", upload.single("catProfilePhoto"), (req, res) => {
  const {
    userEmail,
    managementSpaceId,
    catName,
    catAge,
    catWeight,
    catPhotosUrlForAI,
    isEatingFeedStuff,
    catFeedStuffDailyConsumption,
    catFeedStuffMoistureContent,
    isHydrationAuto,
    catGoalHydration,
  } = req.body;
  const catProfilePhoto = req.file;

  // 공통적인 변수
  let generatedSpaceId;
  let catInfoQuery, uploadParams, catTableQuery;

  // 처음 등록하는 경우
  if (!managementSpaceId) {
    generatedSpaceId = Math.random().toString(36).substring(2, 12);

    // Step 1: management_space_id 업서트
    const upsertManagementSpaceQuery = `
      INSERT INTO management_space (management_space_id, main_manager_user_email)
      VALUES ('${generatedSpaceId}', '${userEmail}')
      ON DUPLICATE KEY UPDATE main_manager_user_email = '${userEmail}'
    `;

    connection.query(upsertManagementSpaceQuery, (err) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }

      // Step 3: cat_in_management_space table 생성
      catTableQuery = `
        CREATE TABLE IF NOT EXISTS cat_in_management_space_${generatedSpaceId} (
          cat_id INT PRIMARY KEY AUTO_INCREMENT,
          cat_profile_photo VARCHAR(255) NOT NULL,
          cat_name VARCHAR(255) NOT NULL,
          cat_age INT NOT NULL,
          cat_weight FLOAT NOT NULL,
          cat_photos JSON,
          cat_feedstuff_daily_consumption INT NOT NULL,
          cat_feedstuff_moisture_content FLOAT NOT NULL,
          is_hydration_auto BOOLEAN NOT NULL,
          is_eating_feedstuff BOOLEAN NOT NULL,
          cat_goal_hydration FLOAT NOT NULL
        )
      `;

      connection.query(catTableQuery, (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }

        handleCatInfoQuery(generatedSpaceId);
      });
    });
  } else {
    // 추가 등록하는 경우
    handleCatInfoQuery(managementSpaceId);
  }

  function handleCatInfoQuery(spaceId) {
    // S3에 이미지 업로드
    uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `catimages/${Date.now()}_${catProfilePhoto.originalname}`,
      Body: catProfilePhoto.buffer,
      ACL: "public-read",
    };

    s3.upload(uploadParams, (err, data) => {
      if (err) {
        return res.status(500).json({ message: "S3 upload error", error: err });
      }
      const catProfilePhotoUrl = data.Location;

      // 공통적인 쿼리
      catInfoQuery = `
        INSERT INTO cat_in_management_space_${spaceId} (
          cat_profile_photo, cat_name, cat_age, cat_weight,
          cat_photos, cat_feedstuff_daily_consumption,
          cat_feedstuff_moisture_content, is_hydration_auto,
          is_eating_feedstuff, cat_goal_hydration
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        catInfoQuery,
        [
          catProfilePhotoUrl,
          catName,
          catAge,
          catWeight,
          catPhotosUrlForAI,
          catFeedStuffDailyConsumption,
          catFeedStuffMoistureContent,
          isHydrationAuto,
          isEatingFeedStuff,
          catGoalHydration,
        ],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "Database error", error: err });
          }

          const catId = result.insertId;

          // Step 7: cat_hydration_statistics table 생성
          const catHydrationTableQuery = `
            CREATE TABLE IF NOT EXISTS cat_hydration_statistics_${spaceId}_${catId} (
                date DATE NOT NULL PRIMARY KEY,
                day INT NOT NULL,
                goal_hydration FLOAT NOT NULL,
                actual_hydration FLOAT DEFAULT 0,
                hydration_guage FLOAT DEFAULT 0
            )
          `;

          connection.query(catHydrationTableQuery, (err) => {
            if (err) {
              return res
                .status(500)
                .json({ message: "Database error", error: err });
            }

            // Step 8: cat_hydration_statistics 데이터 삽입
            const catHydrationInsertQuery = `
              INSERT INTO cat_hydration_statistics_${spaceId}_${catId} (
                date, day, goal_hydration
              )
              VALUES (DATE_FORMAT(NOW(), '%Y-%m-%d'), DAYOFWEEK(NOW()), ?)
            `;

            connection.query(
              catHydrationInsertQuery,
              [catGoalHydration],
              (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Database error", error: err });
                }

                // Step 9: user 테이블 업데이트
                const userUpdateQuery = `
                  UPDATE user SET management_space_id = '${spaceId}'
                  WHERE user_email = '${userEmail}'
                `;

                connection.query(userUpdateQuery, (err) => {
                  if (err) {
                    return res
                      .status(500)
                      .json({ message: "Database error", error: err });
                  }

                  // Step 10: 응답
                  if (!managementSpaceId) {
                    res.json({ spaceId: spaceId });
                  } else {
                    res.json({ addSuccess: true });
                  }
                });
              }
            );
          });
        }
      );
    });
  }
});

module.exports = {
  registCatInfo: serverless(app),
};
