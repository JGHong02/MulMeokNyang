const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const crypto = require('crypto');

const app = express();
const PORT = 3100;

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
    const userEmail = req.body.userEmail;
    const providedSessionId = req.body.sessionID;

    if (userEmail) {  // Case 1: 자동 로그인이 설정되지 않은 사용자
        const sessionId = generateSessionId();

        const query = 'INSERT INTO session (sessionID, userEmail) VALUES (?, ?)';
        db.query(query, [sessionId, userEmail], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            sendResponse(userEmail, sessionId, res);
        });

    } else if (providedSessionId) {  // Case 2: 자동 로그인이 설정된 사용자
        const query = 'SELECT userEmail FROM session WHERE sessionID = ?';
        db.query(query, [providedSessionId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Session not found' });
            }

            const userEmailFromSession = results[0].userEmail;
            sendResponse(userEmailFromSession, null, res);
        });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

function sendResponse(userEmail, sessionId, res) {
    const query = 'SELECT management_space_id FROM user WHERE userEmail = ?';
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const managementSpaceId = results.length > 0 ? results[0].management_space_id : null;
        const responseObj = {
            userEmail: userEmail,
            managementSpaceId: managementSpaceId || null,
        };

        if (sessionId) {
            responseObj.sessionID = sessionId;
        }

        res.json(responseObj);
    });
}

app.listen(PORT, () => {
    console.log(`AutoLogin server is running on http://localhost:${PORT}`);
});
