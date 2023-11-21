const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const mysql = require('mysql2');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

app.use(cors());
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

app.get('/checkUserExists', (req, res) => {
    const { userEmail, userPhoneNum } = req.query;

    const query = 'SELECT COUNT(*) AS userCount FROM user WHERE user_email = ? AND user_phonenum = ?';
    connection.query(query, [userEmail, userPhoneNum], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const userExists = results[0].userCount > 0;
        res.json({ userExists });
    });
});

module.exports = {
    checkUserExists: serverless(app),
};