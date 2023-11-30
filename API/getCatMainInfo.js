const express = require("express");
const app = express("");
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
require("dotenv").config();

app.use(cors());

const rdsConfig = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
};

const connection = mysql.createConnection(rdsConfig);

// GetCatMainInfo API
app.get("/getCatMainInfo", (req, res) => {
  const { catId, managementSpaceId } = req.query;

  // 고양이 정보 조회
  const catInfoQuery = `SELECT cat_name, cat_age, cat_weight FROM cat_in_management_space_${managementSpaceId} WHERE cat_id = ?`;
  connection.query(catInfoQuery, [catId], (err, catResults) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // 고양이 수분 섭취 기록 조회
    const hydrationQuery = `SELECT hydration_guage FROM cat_hydration_statistics_${managementSpaceId}_${catId} ORDER BY date DESC LIMIT 1`;
    connection.query(hydrationQuery, (err, hydrationResults) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const catInfo = catResults[0];
      const hydrationInfo = hydrationResults[0] || { hydration_guage: null };

      res.json({
        catName: catInfo.cat_name,
        catAge: catInfo.cat_age,
        catWeight: catInfo.cat_weight,
        hydrationGuage: hydrationInfo.hydration_guage,
      });
    });
  });
});

module.exports = {
  getCatMainInfo: serverless(app),
};
