const express = require("express");
const app = express();
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const serverless = require("serverless-http");
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
    isEatingFeedStuff,
    catFeedStuffDailyConsumption,
    catFeedStuffMoistureContent,
    isHydrationAuto,
    catGoalHydration,
    catColor,
    catBreed,
  } = req.body;

  console.log(
    "params: ",
    userEmail,
    managementSpaceId,
    catName,
    catAge,
    catWeight,
    isEatingFeedStuff,
    catFeedStuffDailyConsumption,
    catFeedStuffMoistureContent,
    isHydrationAuto,
    catGoalHydration,
    catColor,
    catBreed
  );
  // 파일 첨부 확인
  const catProfilePhoto = req.file;

  let generatedSpaceId;
  let catInfoQuery, uploadParams, catTableQuery;

  const isEatingFeedStuffValue = isEatingFeedStuff === "true" ? 1 : 0;
  const isHydrationAutoValue = isHydrationAuto === "true" ? 1 : 0;

  if (managementSpaceId == "null") {
    // 처음 등록하는 경우
    generatedSpaceId = Math.random().toString(36).substring(2, 12);
    console.log("generatedSpaceId: ", generatedSpaceId);

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
          cat_profile_photo VARCHAR(255),
          cat_name VARCHAR(255) NOT NULL,
          cat_age INT NOT NULL,
          cat_weight FLOAT NOT NULL,
          cat_feedstuff_daily_consumption INT,
          cat_feedstuff_moisture_content FLOAT,
          is_hydration_auto BOOLEAN NOT NULL,
          is_eating_feedstuff BOOLEAN NOT NULL,
          cat_goal_hydration FLOAT NOT NULL,
          cat_color JSON,
          cat_breed VARCHAR(255)
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
  //step 4) cat_in_management_space_${spaceId}에 정보 추가
  function handleCatInfoQuery(spaceId) {
    // 파일이 첨부된 경우
    let middleSpaceId = spaceId;
    console.log("middleSpaceId: ", middleSpaceId);
    let catProfilePhotoUrl = null;
    if (catProfilePhoto) {
      uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `catimages/${Date.now()}_${catProfilePhoto.originalname}`,
        Body: catProfilePhoto.buffer,
        ACL: "public-read",
      };

      // S3에 이미지 업로드
      s3.upload(uploadParams, (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "S3 upload error", error: err });
        }
        catProfilePhotoUrl = data.Location;
        executeCatInfoQuery(middleSpaceId, catProfilePhotoUrl);
      });
    } else {
      executeCatInfoQuery(middleSpaceId, catProfilePhotoUrl);
    }
  }

  function executeCatInfoQuery(spaceId, catProfilePhotoUrl) {
    // 공통적인 쿼리
    let finalSpaceId = spaceId;
    console.log("finalSpaceId: ", finalSpaceId);
    // catColor를 배열로 변환
    const catColorArray = catColor ? catColor.split(",") : [];
    console.log("catColorArray: ", catColorArray);
    catInfoQuery = `
    INSERT INTO cat_in_management_space_${finalSpaceId} (
      cat_profile_photo, cat_name, cat_age, cat_weight,
      cat_feedstuff_daily_consumption,
      cat_feedstuff_moisture_content, is_hydration_auto,
      is_eating_feedstuff, cat_goal_hydration,
      cat_color, cat_breed
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    console.log(
      "params: ",
      catProfilePhotoUrl,
      catName,
      catAge,
      catWeight,
      catFeedStuffDailyConsumption,
      catFeedStuffMoistureContent,
      isHydrationAutoValue,
      isEatingFeedStuffValue,
      catGoalHydration,
      JSON.stringify(catColorArray),
      catBreed
    );

    connection.query(
      catInfoQuery,
      [
        catProfilePhotoUrl,
        catName,
        catAge,
        catWeight,
        catFeedStuffDailyConsumption,
        catFeedStuffMoistureContent,
        isHydrationAutoValue,
        isEatingFeedStuffValue,
        catGoalHydration,
        JSON.stringify(catColorArray),
        catBreed,
      ],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }
        //step 5) cat_id 변수 설정
        const catId = result.insertId;

        // Step 6) cat_hydration_statistics table 생성
        const catHydrationTableQuery = `
          CREATE TABLE IF NOT EXISTS cat_hydration_statistics_${finalSpaceId}_${catId} (
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

          // Step 7) cat_hydration_statistics 데이터 삽입
          const catHydrationInsertQuery = `
            INSERT INTO cat_hydration_statistics_${finalSpaceId}_${catId} (
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

              // Step 8) user 테이블 업데이트
              const userUpdateQuery = `
                UPDATE user SET management_space_id = '${finalSpaceId}'
                WHERE user_email = '${userEmail}'
              `;

              connection.query(userUpdateQuery, (err) => {
                if (err) {
                  return res
                    .status(500)
                    .json({ message: "Database error", error: err });
                }

                // Step 9) 응답
                if (managementSpaceId == "null") {
                  res.json({ spaceId: finalSpaceId });
                } else {
                  res.json({ addSuccess: true });
                }
              });
            }
          );
        });
      }
    );
  }
});

module.exports = {
  registCatInfo: serverless(app),
};
