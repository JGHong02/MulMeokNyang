const express = require('express');
const mysql = require('mysql');
const app = express();
const PORT = process.env.PORT || 3000;

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

// GetManagementSpaceId API
app.get('/getManagementSpaceId', (req, res) => {
    const { userEmail } = req.query;

    const query = 'SELECT management_space_id FROM user WHERE user_email = ?';
    db.query(query, [userEmail], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err });
        }
        if (results.length > 0 && results[0].management_space_id) {
            res.json({ managementSpaceId: results[0].management_space_id });
        } else {
            res.json({ managementSpaceId: null });
        }
    });
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
