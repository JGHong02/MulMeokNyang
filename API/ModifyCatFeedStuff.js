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

// 데이터베이스 연결 및 로그 출력
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database successfully');
});
app.use(express.json());

// ModifyCatFeedStuff API 구현
app.put('/modifyCatFeedStuff', (req, res) => {
    const { managementSpaceId, catId, isEatingFeedStuff, catFeedStuffDailyConsumption, catFeedStuffMoistureContent } = req.body;

    // cat_in_management_space_${managementSpaceId} 테이블에서 해당 catId의 레코드 수정
    const updateCatQuery = `UPDATE cat_in_management_space_${managementSpaceId} SET is_eating_feedstuff = ?, cat_feedstuff_daily_consumption = ?, cat_feedstuff_moisture_content = ? WHERE cat_id = ?`;
    db.query(updateCatQuery, [isEatingFeedStuff, catFeedStuffDailyConsumption, catFeedStuffMoistureContent, catId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        // 음수량 자동 설정 로직
        const selectQuery = `SELECT is_hydration_auto, cat_weight FROM cat_in_management_space_${managementSpaceId} WHERE cat_id = ?`;
        db.query(selectQuery, [catId], (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            if (results.length > 0 && results[0].is_hydration_auto) {
                const { cat_weight } = results[0];
                const newGoalHydration = Math.floor((cat_weight * 50) - (catFeedStuffDailyConsumption * catFeedStuffMoistureContent / 100));

                const updateHydrationQuery = `UPDATE cat_hydration_statistics_${catId} SET goal_hydration = ? ORDER BY date DESC LIMIT 1`;
                db.query(updateHydrationQuery, [newGoalHydration], (err, results) => {
                    if (err) {
                        return res.status(500).send({ error: 'Database error' });
                    }
                    res.send({ modifySuccess: true });
                });
            } else {
                res.send({ modifySuccess: true });
            }
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
