const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const serverless = require("serverless-http");
const dotenv = require("dotenv");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.get("/getCatHydration", (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;

  const tableName = `cat_in_management_space_${spaceId}`;
  const query = `SELECT is_hydration_auto, cat_goal_hydration, cat_weight, cat_feedstuff_daily_consumption, cat_feedstuff_moisture_content FROM ${tableName} WHERE cat_id = ?`;

  connection.query(query, [catId], (err, results) => {
    if (err) {
      res.status(500).send({ error: "Database error" });
      return;
    }
    const data = results[0];

    const catFeedStuffDailyConsumption = data.cat_feedstuff_daily_consumption;
    const catFeedStuffMoistureContent = data.cat_feedstuff_moisture_content;
    const catWeight = data.cat_weight;

    const recommendedHydration = Math.floor(
      catWeight * 50 -
        (catFeedStuffDailyConsumption * catFeedStuffMoistureContent) / 100
    );

    const isHydrationAuto = Boolean(data.is_hydration_auto);
    const catGoalHydration = data.cat_goal_hydration;

    res.send({
      isHydrationAuto: isHydrationAuto,
      catGoalHydration: catGoalHydration,
      recommendedHydration: recommendedHydration,
    });
  });
});

module.exports = {
  getCatHydration: serverless(app),
};
