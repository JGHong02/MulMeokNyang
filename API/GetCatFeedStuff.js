const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = process.env.port ? process.env.port : 3000;

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

app.get('/getCatFeedStuff', (req, res) => {
  const spaceId = req.query.managementSpaceId;
  const catId = req.query.catId;
  
  const tableName = `cat_in_management_space_${spaceId}`;
  const query = `SELECT cat_feedstuff_daily_consumption, cat_feedstuff_moisture_content FROM ${tableName} WHERE cat_id = ?`;

  db.query(query, [catId], (err, results) => {
    if (err) {
      res.status(500).send({ error: 'Database error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).send({ message: 'Cat not found' });
      return;
    }

    const data = results[0];
    res.send({
      catFeedStuffDailyConsumption: data.cat_feedstuff_daily_consumption,
      catFeedStuffMoistureContent: data.cat_feedstuff_moisture_content
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});