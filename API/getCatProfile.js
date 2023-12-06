const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

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

//getCatProfile API
app.get("/getCatProfile", async (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;

  // 고양이 정보 조회
  const getCatInfoQuery = `
      SELECT cat_profile_photo, cat_name, cat_age, cat_weight
      FROM cat_in_management_space_${spaceId}
      WHERE cat_id = ?;
    `;

  try {
    const catInfoResult = await executeQuery(getCatInfoQuery, [catId]);

    if (catInfoResult.length === 0) {
      return res.status(404).json({ message: "Cat not found" });
    }

    const catInfo = catInfoResult[0];

    res.json({
      catProfilePhoto: catInfo.cat_profile_photo,
      catName: catInfo.cat_name,
      catAge: catInfo.cat_age,
      catWeight: catInfo.cat_weight,
    });
  } catch (error) {
    console.error("Error getting cat info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

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
  getCatProfile: serverless(app),
};
