const express = require("express");
const mysql = require("mysql2");
const AWS = require("aws-sdk");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dotenv = require("dotenv");
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

// ModifyCatProfile API
app.put(
  "/modifyCatProfile",
  upload.single("catProfilePhoto"),
  async (req, res) => {
    const { managementSpaceId, catId, catName, catAge, catWeight } = req.body;
    const catProfilePhoto = req.file;

    try {
      if (catProfilePhoto) {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `catimages/${Date.now()}_${catProfilePhoto.originalname}`,
          Body: catProfilePhoto.buffer,
          ContentType: catProfilePhoto.mimetype,
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

          const catImageUrl = data.Location;

          const updateQuery = `UPDATE cat_in_management_space_${managementSpaceId} 
                                 SET cat_profile_photo = ?, cat_name = ?, cat_age = ?, cat_weight = ? 
                                 WHERE cat_id = ?`;

          connection.query(
            updateQuery,
            [catImageUrl, catName, catAge, catWeight, catId],
            (dbErr, results) => {
              if (dbErr) {
                console.error("Database error: ", dbErr);
                return res.status(500).send({ error: "Database error" });
              }

              console.log("Query results: ", results);
              res.send({ modifySuccess: true });
            }
          );
        });
      } else {
        return res.status(400).send({ error: "No file uploaded" });
      }
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = {
  modifyCatProfile: serverless(app),
};
