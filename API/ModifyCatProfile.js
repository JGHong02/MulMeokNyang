const express = require('express');
const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

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
// 파일 저장을 위한 디렉토리 설정
const fileDirectory = path.join(__dirname, '/uploads');

// 파일 업로드 미들웨어 설정
app.use(fileUpload());

// JSON 요청 본문 파싱을 위한 미들웨어
app.use(express.json());

// 파일 저장 디렉토리 생성 (없을 경우)
if (!fs.existsSync(fileDirectory)) {
    fs.mkdirSync(fileDirectory);
}
console.log(`File directory is set to: ${fileDirectory}`);

// ModifyCatProfile API 구현
app.put('/modifyCatProfile', (req, res) => {
    const { managementSpaceId, catId, catName, catAge, catWeight } = req.body;

    if (req.files && req.files.catProfilePhoto) {
        const catProfilePhoto = req.files.catProfilePhoto;
        const filename = catId + '_' + Date.now() + path.extname(catProfilePhoto.name); // 예: 1_1617701234567.jpg
        const savePath = path.join(fileDirectory, filename);

        // 파일 저장
        catProfilePhoto.mv(savePath, err => {
            if (err) {
                return res.status(500).send({ error: 'Failed to save the file' });
            }

            const updateQuery = `UPDATE cat_in_management_space_${managementSpaceId} 
                                 SET cat_profile_photo = ?, cat_name = ?, cat_age = ?, cat_weight = ? 
                                 WHERE cat_id = ?`;

            db.query(updateQuery, [savePath, catName, catAge, catWeight, catId], (dbErr, results) => {
                if (dbErr) {
                    return res.status(500).send({ error: 'Database error' });
                }
                res.send({ modifySuccess: true });
            });
        });
    } else {
        return res.status(400).send({ error: 'No file uploaded' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
