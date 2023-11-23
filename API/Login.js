const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT ? process.env.PORT : 3000;

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
    console.log('Database connected as id ' + db.threadId);
});

// Express 앱 설정
app.use(bodyParser.json());

// Login API
app.post('/login', (req, res) => {
    const { userEmail, userPw, autoLogin } = req.body;
    let query = 'SELECT * FROM user WHERE user_email = ? AND user_pw = ?';

    db.query(query, [userEmail, userPw], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }

        if (results.length > 0) {
            const user = results[0];
            const userNickname = user.user_nickname || null;
            const managementSpaceId = user.management_space_id || null;

            if (autoLogin && userNickname) {
                // Auto Login 로직 (세션 생성 및 처리 필요)
                // 예시로 임시 세션 ID 생성
                const sessionId = 'temp_session_id'; // 실제 세션 ID 생성 로직 필요
                res.json({ userEmail, userNickname, managementSpaceId, sessionId });
            } else {
                res.json({ userEmail, userNickname, managementSpaceId, sessionId: null });
            }
        } else {
            res.json({ userExists: false });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
