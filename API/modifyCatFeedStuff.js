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

// ModifyCatFeedStuff API
app.put("/modifyCatFeedStuff", (req, res) => {
  const {
    managementSpaceId,
    catId,
    isEatingFeedStuff,
    catFeedStuffDailyConsumption,
    catFeedStuffMoistureContent,
  } = req.body;

  // cat_in_management_space_${managementSpaceId} 테이블에서 해당 catId의 레코드 수정
  const isEatingFeedstuffValue = isEatingFeedStuff ? 1 : 0;

  const updateCatQuery = `
    UPDATE cat_in_management_space_${managementSpaceId}
    SET is_eating_feedstuff = ?, cat_feedstuff_daily_consumption = ?, cat_feedstuff_moisture_content = ?
    WHERE cat_id = ?`;

  connection.query(
    updateCatQuery,
    [
      isEatingFeedstuffValue,
      catFeedStuffDailyConsumption,
      catFeedStuffMoistureContent,
      catId,
    ],
    (err, results) => {
      if (err) {
        console.error("Error updating cat record: ", err);
        return res.status(500).send({ error: "Database error" });
      }

      // Case 1: 음수량 자동 설정
      const selectQuery = `SELECT is_hydration_auto, cat_weight FROM cat_in_management_space_${managementSpaceId} WHERE cat_id = ?`;
      connection.query(selectQuery, [catId], (err, results) => {
        if (err) {
          console.error("Error selecting cat record: ", err);
          return res.status(500).send({ error: "Database error" });
        }

        if (results.length > 0 && results[0].is_hydration_auto) {
          const { cat_weight } = results[0];
          const newGoalHydration = Math.floor(
            cat_weight * 50 -
              (catFeedStuffDailyConsumption * catFeedStuffMoistureContent) / 100
          );

          // cat_in_management_space_${managementSpaceId} 테이블에서 cat_goal_hydration 값 수정
          const updateGoalHydrationQuery = `UPDATE cat_in_management_space_${managementSpaceId} SET cat_goal_hydration = ? WHERE cat_id = ?`;
          connection.query(
            updateGoalHydrationQuery,
            [newGoalHydration, catId],
            (err, results) => {
              if (err) {
                console.error("Error updating cat goal hydration: ", err);
                return res.status(500).send({ error: "Database error" });
              }

              // cat_hydration_statistics_${catId} 테이블에서 가장 최신의 record를 조회해, goal_hydration 값을 newGoalHydration로 수정
              const updateHydrationStatisticsQuery = `UPDATE cat_hydration_statistics_${spaceId}_${catId} SET goal_hydration = ? ORDER BY date DESC LIMIT 1`;
              connection.query(
                updateHydrationStatisticsQuery,
                [newGoalHydration],
                (err, results) => {
                  if (err) {
                    console.error("Error updating hydration statistics: ", err);
                    return res.status(500).send({ error: "Database error" });
                  }

                  res.send({ modifySuccess: true });
                }
              );
            }
          );
        } else {
          res.send({ modifySuccess: true });
        }
      });
    }
  );
});

module.exports = {
  modifyCatFeedStuff: serverless(app),
};
