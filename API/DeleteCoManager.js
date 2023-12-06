const express = require('express');
const mysql = require('mysql');

const app = express();
const port = 3000;

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
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Database connection established');
});

// DeleteComanager API 구현
app.delete('/DeleteComanager', (req, res) => {
    const userEmail = req.query.coManagerUserEmail;
    const spaceId = req.query.managementSpaceId;

    // user 테이블에서 coManagerUserEmail의 management_space_id 업데이트
    const updateUserQuery = "UPDATE user SET management_space_id = '' WHERE user_email = ?";
    db.query(updateUserQuery, [userEmail], (err) => {
        if (err) {
            console.error('Error updating user:', err);
            return res.status(500).send('Internal server error');
        }

        // management_space 테이블에서 co_managers_user_email 정보 가져오기
        const getCoManagersQuery = 'SELECT co_managers_user_email FROM management_space WHERE management_space_id = ?';
        db.query(getCoManagersQuery, [spaceId], (err, results) => {
            if (err) {
                console.error('Error fetching co-managers:', err);
                return res.status(500).send('Internal server error');
            }

            // userEmail을 제외한 새로운 co_managers_user_email 리스트 생성
            const coManagers = JSON.parse(results[0].co_managers_user_email);
            const updatedCoManagers = coManagers.filter(email => email !== userEmail);
            const updatedCoManagersJson = JSON.stringify(updatedCoManagers);

            // management_space 테이블 업데이트
            const updateSpaceQuery = 'UPDATE management_space SET co_managers_user_email = ? WHERE management_space_id = ?';
            db.query(updateSpaceQuery, [updatedCoManagersJson, spaceId], (err) => {
                if (err) {
                    console.error('Error updating management space:', err);
                    return res.status(500).send('Internal server error');
                }

                res.json({ deleteSuccess: true });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
