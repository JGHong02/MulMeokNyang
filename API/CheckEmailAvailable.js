const express = require('express');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

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
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// 이메일 사용 가능 여부 확인 API
app.get('/check-email', (req, res) => {
    const { userEmail } = req.query;

    // 입력된 이메일이 데이터베이스에 존재하는지 확인
    const query = 'SELECT 1 FROM user WHERE user_email = ? LIMIT 1';
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // 결과가 있으면 false, 없으면 true 반환
        const isAvailable = results.length === 0;
        res.json({ available: isAvailable });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});