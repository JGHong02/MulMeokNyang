const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

app.use(express.json());

// 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
    user: 'hyoju8618',
    password: 'ahj6381hyn!',
    database: 'mydatabase'
});

// 데이터베이스 연결 및 연결 상태 확인
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database.');
});

// GetFindEmail API
app.get('/getFindEmail', (req, res) => {
    const { userName, userPhoneNum } = req.query;

    // 데이터베이스에서 사용자 조회
    const query = 'SELECT user_email FROM user WHERE user_name = ? AND user_phonenum = ?';
    db.query(query, [userName, userPhoneNum], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length > 0) {
            // 사용자가 존재하는 경우
            const userEmail = results[0].user_email;
            res.json({ userEmail });
        } else {
            // 사용자가 존재하지 않는 경우
            res.json({ userEmail: null });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
