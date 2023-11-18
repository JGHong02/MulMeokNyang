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

// DeleteCatInfo API 구현
app.delete('/DeleteCatInfo', (req, res) => {
    const catId = req.query.catId; // 고양이 ID
    const spaceId = req.query.managementSpaceId; // 공간 ID
  
    // user 테이블에서 catId와 spaceId를 사용하여 고양이 정보 삭제
    const deleteCatQuery = `DELETE FROM user WHERE user_email = ? AND management_space_id = ?`;
    db.query(deleteCatQuery, [catId, spaceId], (err) => {
        if (err) {
            console.error('Error deleting cat info:', err);
            return res.status(500).send('Internal server error');
  }
  
        res.json({ deleteSuccess: true });
    });
  });
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
