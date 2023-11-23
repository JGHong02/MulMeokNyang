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

// 데이터베이스 연결 시도
db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database successfully');
});

// LocalSignUp API
app.post('/localSignUp', (req, res) => {
    const { userEmail, userPw, userName, userPhoneNum } = req.body;

    // 유효성 검사 (이 예제에서는 간단하게 처리)
    if (!userEmail || !userPw || !userName || !userPhoneNum) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    // 사용자 정보 데이터베이스에 추가
    const query = 'INSERT INTO user (user_email, user_pw, user_name, user_phonenum) VALUES (?, ?, ?, ?)';
    db.query(query, [userEmail, userPw, userName, userPhoneNum], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        res.json({ signUpSuccess: true });
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
