const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

app.use(bodyParser.json());

// 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
    user: 'hyoju8618',
    password: 'ahj6381hyn!',
    database: 'mydatabase'
});

// 데이터베이스 연결
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Database connection established');
});

app.get('/check-message-auth-code', (req, res) => {
    const { userPhoneNum, authCode } = req.query;

    // 데이터베이스에서 인증 코드 확인
    const query = 'SELECT COUNT(*) AS userCount FROM user WHERE user_email = ? AND user_phonenum = ?';
    db.query(query, [userPhoneNum, authCode], (err, results) => {
        if (err) {
            console.error('Database query error: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const authSuccess = results.length > 0;
        res.json({ authSuccess });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});