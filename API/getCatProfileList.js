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

app.get("/getCatProfileList", async (req, res) => {
  const spaceId = req.query.managementSpaceId;

  // Step 1: cat_in_management_space_${spaceId} 테이블에서 cat_id 값 조회
  const getCatIdsQuery = `SELECT cat_id FROM cat_in_management_space_${spaceId}`;
  const catIdResults = await executeQuery(getCatIdsQuery);

  // cat_id 값을 배열로 추출
  const catIdArr = catIdResults.map((result) => result.cat_id);

  // Step 2: cat_in_management_space_${spaceId} 테이블에서 cat_profile_photo 값 조회
  const getCatProfilePhotosQuery = `SELECT cat_profile_photo FROM cat_in_management_space_${spaceId}`;
  const catProfilePhotoResults = await executeQuery(getCatProfilePhotosQuery);

  // cat_profile_photo 값을 배열로 추출
  const catProfilePhotoArr = catProfilePhotoResults.map(
    (result) => result.cat_profile_photo
  );

  // Step 3: catIdArr와 catProfilePhotoArr을 HTTP 응답으로 전송
  res.json({ catIdArr, catProfilePhotoArr });
});

function executeQuery(query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  getCatProfileList: serverless(app),
};
