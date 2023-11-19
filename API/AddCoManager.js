const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

app.use(express.json());

// MySQL 데이터베이스 연결 설정
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

// AddCoManager API 구현
app.post('/add-co-manager', (req, res) => {
    const { managementSpaceId, userNickname } = req.body;

    // userNickname을 사용하여 user_email 찾기
    db.query('SELECT user_email FROM user WHERE user_nickname = ?', [userNickname], (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userEmail = users[0].user_email;

        // coManagersUserEmail 업데이트
        db.query('SELECT co_managers_user_email FROM management_space WHERE management_space_id = ?', [managementSpaceId], (err, spaces) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (spaces.length === 0) {
                return res.status(404).json({ message: 'Management space not found' });
            }

            let coManagersUserEmail = JSON.parse(spaces[0].co_managers_user_email);
            coManagersUserEmail.push(userEmail);
            coManagersUserEmail = JSON.stringify(coManagersUserEmail);

            // coManagersUserEmail 업데이트
            db.query('UPDATE management_space SET co_managers_user_email = ? WHERE management_space_id = ?', [coManagersUserEmail, managementSpaceId], (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                res.json({ addSuccess: true });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
