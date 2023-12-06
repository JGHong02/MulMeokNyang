const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = 3000;

app.use(express.json());

// 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
    user: 'hyoju8618',
    password: 'ahj6381hyn!',
    database: 'mydatabase'
});

// 데이터베이스 연결 확인
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});

// Logout API
app.delete('/logout', (req, res) => {
    const { userEmail } = req.body;

    // 세션 테이블에서 사용자 세션 삭제
    const query = 'DELETE FROM session WHERE user_email = ?';
    db.query(query, [userEmail], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        // 로그아웃 성공 여부 전송
        res.json({ logoutSuccess: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
