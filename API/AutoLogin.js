const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'mydb-instance.c3emgnv7ms58.eu-north-1.rds.amazonaws.com',
    user: 'hyoju8618',
    password: 'ahj6381hyn!',
    database: 'mydatabase'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

function generateSessionId() {
    return crypto.randomBytes(16).toString('hex');
}

app.post('/autologin', (req, res) => {
    const user_email = req.body.userEmail;

    if (user_email) {
        const sessionId = generateSessionId();

        // 세션 ID 업데이트 또는 새로운 세션 생성
        const query = `
            INSERT INTO session (session_id, user_email) 
            VALUES (?, ?) 
            ON DUPLICATE KEY 
            UPDATE session_id = VALUES(session_id);`;

        db.query(query, [sessionId, user_email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            // 관리 공간 ID 조회
            const spaceQuery = 'SELECT management_space_id FROM user WHERE user_email = ?';
            db.query(spaceQuery, [user_email], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                const managementSpaceId = results.length > 0 ? results[0].management_space_id : null;
                // 세션 ID와 관리 공간 ID만 반환
                res.json({ managementSpaceId, sessionID: sessionId });
            });
        });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
