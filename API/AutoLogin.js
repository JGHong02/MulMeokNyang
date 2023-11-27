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
    const providedSessionId = req.body.sessionID;

    if (user_email) {
        const sessionId = generateSessionId();

        const query = 'INSERT INTO session (session_id, user_email) VALUES (?, ?)';
        db.query(query, [sessionId, user_email], (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            sendResponse(user_email, sessionId, res);
        });

    } else if (providedSessionId) {
        const query = 'SELECT user_email FROM session WHERE session_id = ?';
        db.query(query, [providedSessionId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Session not found' });
            }

            const userEmailFromSession = results[0].user_email;
            sendResponse(userEmailFromSession, null, res);
        });
    } else {
        res.status(400).json({ error: 'Invalid request' });
    }
});

function sendResponse(user_email, sessionId, res) {
    const query = 'SELECT management_space_id FROM user WHERE user_email = ?';
    db.query(query, [user_email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const managementSpaceId = results.length > 0 ? results[0].management_space_id : null;
        const responseObj = {
            userEmail: user_email,
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
