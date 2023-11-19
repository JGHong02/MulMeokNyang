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
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});

app.use(express.json());

// ModifyCatHydration API 구현
app.put('/modifyCatHydration', (req, res) => {
    const { managementSpaceId, catId, isHydrationAuto, catGoalHydration } = req.body;

    // cat_in_management_space_${managementSpaceId} 테이블에서 해당 catId의 레코드 수정
    const updateQuery = `UPDATE cat_in_management_space_${managementSpaceId} SET is_hydration_auto = ?, cat_goal_hydration = ? WHERE cat_id = ?`;
    db.query(updateQuery, [isHydrationAuto, catGoalHydration, catId], (err, results) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }

        // cat_hydration_statistics_${catId} 테이블에서 최신 레코드의 actual_hydration 조회
        const selectQuery = `SELECT actual_hydration FROM cat_hydration_statistics_${catId} ORDER BY date DESC LIMIT 1`;
        db.query(selectQuery, (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            if (results.length > 0) {
                const actualHydration = results[0].actual_hydration;
                const hydrationGuage = Math.floor(actualHydration / catGoalHydration);

                // cat_hydration_statistics_${catId} 테이블에서 최신 레코드의 goal_hydration, hydration_guage 수정
                const updateStatsQuery = `UPDATE cat_hydration_statistics_${catId} SET goal_hydration = ?, hydration_guage = ? ORDER BY date DESC LIMIT 1`;
                db.query(updateStatsQuery, [catGoalHydration, hydrationGuage], (err, results) => {
                    if (err) {
                        return res.status(500).send({ error: 'Database error' });
                    }

                    res.send({ modifySuccess: true });
                });
            } else {
                res.send({ modifySuccess: false, message: "No recent hydration data found" });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
