const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

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

// 데이터베이스 연결
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Database connection established');
});

app.get('/getCatHydration', (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;

  const tableName = `cat_in_management_space_${spaceId}`;
  const query = `SELECT is_hydration_auto, cat_goal_hydration FROM ${tableName} WHERE cat_id = ?`;

  connection.query(query, [catId], (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Database error' });
      return;
    }

    const data = results[0];
    res.send({
      isHydrationAuto: data.is_hydration_auto,
      catGoalHydration: data.cat_goal_hydration
    });
  });
});

module.exports = {
  getCatHydration: serverless(app)
};