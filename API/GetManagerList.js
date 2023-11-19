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

// GetManagerList API 구현
app.get('/get-manager-list', (req, res) => {
    const spaceId = req.query.managementSpaceId;

    const query = `SELECT main_manager_user_email, co_managers_user_email FROM management_space WHERE management_space_id = ?`;
    db.query(query, [spaceId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Management space not found' });
        }

        const { main_manager_user_email, co_managers_user_email } = results[0];
        res.json({ mainManagerUserEmail: main_manager_user_email, coManagersUserEmail: co_managers_user_email });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
