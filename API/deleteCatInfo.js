const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');
const dotenv = require('dotenv');

app.use(cors());

dotenv.config();

const rdsConfig = {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
  };
  
  const connection = mysql.createConnection(rdsConfig);


// 데이터베이스 연결
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

// DeleteCatInfo API 구현
app.delete('/deleteCatInfo', (req, res) => {
    const catId = req.query.catId; // 고양이 ID
    const spaceId = req.query.managementSpaceId; // 공간 ID
  
    // user 테이블에서 catId와 spaceId를 사용하여 고양이 정보 삭제
    const deleteCatQuery = 'DELETE FROM user WHERE user_email = ? AND management_space_id = ?';
connection.query(deleteCatQuery, [catId, spaceId], (err, results) => {
    if (err) {
        console.error('고양이 정보 삭제 중 오류 발생:', err);
        return res.status(500).send('내부 서버 오류');
    }

    if (results.affectedRows === 0) {
        // 영향 받은 행이 없으면 해당하는 고양이 정보를 찾지 못한 것
        return res.status(204).json({ deleteSuccess: false, message: '고양이 정보를 찾을 수 없습니다.' });
    }

    res.json({ deleteSuccess: true });
    });
  });
  

module.exports = {
    deleteCatInfo: serverless(app),
};
