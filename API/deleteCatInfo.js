const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
    console.error("Error connecting to the database: " + err.stack);
    return;
  }
  console.log("Connected to the database");
});

// DeleteCatInfo API
app.delete("/deleteCatInfo", (req, res) => {
  const { catId, managementSpaceId } = req.body;

  // 고양이 음수량 테이블 삭제
  const deleteCatStatisticsQuery = `DROP TABLE IF EXISTS cat_hydration_statistics_${managementSpaceId}_${catId}`;
  connection.query(deleteCatStatisticsQuery, (err) => {
    if (err) {
      console.error("Cannot delete staticstics table: ", err);
      return res.status(500).send("Database error");
    }

    //cat_in_management_space_{spaceId}에서 고양이 정보 삭제
    const deleteCatRecordQuery = `
      DELETE FROM cat_in_management_space_${managementSpaceId}
      WHERE cat_id = ${catId}
    `;
    connection.query(deleteCatRecordQuery, (err) => {
      if (err) {
        console.error(
          "Cannot delete Cat Record in cat_in_management_space: ",
          err
        );
        return res.status(500).send("Database error");
      }

      res.json({ deleteSuccess: true });
    });
  });
});

module.exports = {
  deleteCatInfo: serverless(app),
};
