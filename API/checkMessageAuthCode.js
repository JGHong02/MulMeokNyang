const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

app.use(cors());
app.use(bodyParser.json());

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

app.get('/checkMessageAuthCode', (req, res) => {
    const { userPhoneNum, authCode } = req.query;

    // 데이터베이스에서 인증 코드 확인
    const query = 'SELECT COUNT(*) AS userCount FROM user WHERE user_email = ? AND user_phonenum = ?';
    connection.query(query, [userPhoneNum, authCode], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const authSuccess = results.length > 0;
        res.json({ authSuccess });
    });
});

module.exports = {
    checkMessageAuthCode: serverless(app),
};