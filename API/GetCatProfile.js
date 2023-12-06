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
        console.error('데이터베이스 연결 오류: ' + err.stack);
        return;
    }
    console.log('데이터베이스에 연결됨');
});

// GetCatProfile API 구현
app.get('/get-cat-profile', (req, res) => {
    // 클라이언트에서 보낸 managementSpaceId와 catId 값을 받음
    const spaceId = req.query.managementSpaceId;
    const catId = req.query.catId;

    // 쿼리 실행
    const query = `SELECT cat_profile_photo, cat_name, cat_age, cat_weight FROM cat_in_management_space_${spaceId} WHERE cat_id = ?`;
    db.query(query, [catId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (results.length === 0) {
            return res.json({ searchResultExists: false });
        }

        // 결과를 변수에 저장
        const { cat_profile_photo, cat_name, cat_age, cat_weight } = results[0];
        
        // 응답으로 변수 전송
        res.json({ catProfilePhoto: cat_profile_photo, catName: cat_name, catAge: cat_age, catWeight: cat_weight });
    });
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT}에서 실행 중`);
});
