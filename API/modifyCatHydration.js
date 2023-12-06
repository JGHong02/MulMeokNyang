const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

// ModifyCatHydration API
app.put("/modifyCatHydration", (req, res) => {
  const { managementSpaceId, catId, isHydrationAuto, catGoalHydration } =
    req.body;

  // cat_in_management_space_${managementSpaceId} 테이블에서 해당 catId의 레코드 수정
  const updateQuery = `UPDATE cat_in_management_space_${managementSpaceId} SET is_hydration_auto = ?, cat_goal_hydration = ? WHERE cat_id = ?`;
  connection.query(
    updateQuery,
    [isHydrationAuto, catGoalHydration, catId],
    (err, results) => {
      if (err) {
        return res.status(500).send({ error: "Database error" });
      }

      // cat_hydration_statistics_${catId} 테이블에서 최신 레코드의 actual_hydration 조회
      const selectQuery = `SELECT actual_hydration FROM cat_hydration_statistics_${managementSpaceId}_${catId} ORDER BY date DESC LIMIT 1`;
      connection.query(selectQuery, (err, results) => {
        if (err) {
          return res.status(500).send({ error: "Database error" });
        }

        if (results.length > 0) {
          const actualHydration = results[0].actual_hydration;
          const hydrationGuage = Math.floor(actualHydration / catGoalHydration);

          // cat_hydration_statistics_${catId} 테이블에서 최신 레코드의 goal_hydration, hydration_guage 수정
          const updateStatsQuery = `UPDATE cat_hydration_statistics_${managementSpaceId}_${catId} SET goal_hydration = ?, hydration_guage = ? ORDER BY date DESC LIMIT 1`;
          connection.query(
            updateStatsQuery,
            [catGoalHydration, hydrationGuage],
            (err, results) => {
              if (err) {
                return res.status(500).send({ error: "Database error" });
              }

              res.send({ modifySuccess: true });
            }
          );
        } else {
          res.send({
            modifySuccess: false,
            message: "No recent hydration data found",
          });
        }
      });
    }
  );
});

module.exports = {
  modifyCatHydration: serverless(app),
};
