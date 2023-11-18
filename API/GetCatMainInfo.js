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
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

// GetCatMainInfo API 구현
app.get('/getCatMainInfo', (req, res) => {
    const { catId, managementSpaceId } = req.query;
    
    // 고양이 정보 조회
    const catInfoQuery = `SELECT cat_name, cat_age, cat_weight FROM cat_in_management_space_${managementSpaceId} WHERE cat_id = ?`;
    db.query(catInfoQuery, [catId], (err, catResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // 고양이 수분 섭취 기록 조회
        const hydrationQuery = `SELECT hydration_guage FROM cat_hydration_statistics_${catId} ORDER BY date DESC LIMIT 1`;
        db.query(hydrationQuery, (err, hydrationResults) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const catInfo = catResults[0];
            const hydrationInfo = hydrationResults[0] || { hydration_guage: null };

            res.json({
                catName: catInfo.cat_name,
                catAge: catInfo.cat_age,
                catWeight: catInfo.cat_weight,
                hydrationGuage: hydrationInfo.hydration_guage
            });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
