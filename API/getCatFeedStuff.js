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

app.get("/getCatFeedStuff", (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;

  const tableName = `cat_in_management_space_${spaceId}`;
  const query = `SELECT cat_feedstuff_daily_consumption, cat_feedstuff_moisture_content FROM ${tableName} WHERE cat_id = ?`;

  connection.query(query, [catId], (err, results) => {
    if (err) {
      res.status(500).send({ error: "Database error" });
      return;
    }

    if (results.length === 0) {
      res.status(204).send({ message: "Cat not found" });
      return;
    }

    const data = results[0];
    res.send({
      catFeedStuffDailyConsumption: data.cat_feedstuff_daily_consumption,
      catFeedStuffMoistureContent: data.cat_feedstuff_moisture_content,
    });
  });
});

module.exports = {
  getCatFeedStuff: serverless(app),
};
