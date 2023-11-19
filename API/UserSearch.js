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

// UserSearch API 구현
app.get('/user-search', (req, res) => {
    const userNickname = req.query.userNickname;

    const query = 'SELECT user_email, user_profile_photo, user_introduction FROM user WHERE user_nickname = ? AND management_space_id = ""';
    db.query(query, [userNickname], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.json({ searchResultExists: false });
        }

        const { user_email, user_profile_photo, user_introduction } = results[0];
        res.json({ userEmail: user_email, userProfilePhoto: user_profile_photo, userIntroduction: user_introduction });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
