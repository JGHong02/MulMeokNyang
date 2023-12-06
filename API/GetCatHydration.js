const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
  user: 'hyoju8618',
  password: 'ahj6381hyn!',
  database: 'mydatabase'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Database connected!');
});

app.get('/getCatHydration', (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;

  const tableName = `cat_in_management_space_${spaceId}`;
  const query = `SELECT is_hydration_auto, cat_goal_hydration FROM ${tableName} WHERE cat_id = ?`;

  db.query(query, [catId], (err, results) => {
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});