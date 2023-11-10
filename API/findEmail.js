const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');

app.use(cors());

const rdsConfig = {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
  };
  
  const connection = mysql.createConnection(rdsConfig);
  
// GET 엔드포인트: /getUserEmail
app.get('/getUserEmail', (req, res) => {
    const { userName, userPhoneNum } = req.query;

    const query = 'SELECT user_email FROM user WHERE user_name = ? AND user_phonenum = ?';
    const queryParams = [userName, userPhoneNum];

    connection.query(query, queryParams, (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Database Error' });
        } else if (results.length > 0) {
            res.status(200).json({ userEmail: results[0].user_email });
        } else {
            res.status(404).json({
                error: "Email not found",
                userEmail: null
            });
        }
    });
});

module.exports = {
    findEmail: serverless(app),
};