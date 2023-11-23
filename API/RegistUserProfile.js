const express = require('express');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 데이터베이스 연결 설정
const db = mysql.createConnection({
    host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
    user: 'hyoju8618',
    password: 'ahj6381hyn!',
    database: 'mydatabase'
});

// 데이터베이스 연결
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Database connected successfully');
});

// RegisterUserProfile API
app.post('/registerUserProfile', upload.single('userProfilePhoto'), (req, res) => {
    const { userEmail, userNickname, userIntroduction } = req.body;
    const userProfilePhoto = req.file ? req.file.path : null;

    // 닉네임 중복 검사
    db.query('SELECT user_nickname FROM user WHERE user_nickname = ?', [userNickname], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }

        if (results.length > 0) {
            return res.json({ nicknameExists: true });
        }

        // 사용자 프로필 정보 업데이트
        db.query('UPDATE user SET user_profile_photo = ?, user_nickname = ?, user_introduction = ? WHERE user_email = ?', [userProfilePhoto, userNickname, userIntroduction, userEmail], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err });
            }
            res.json({ registDone: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
