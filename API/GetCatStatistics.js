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

// GetCatStatics API 구현
app.get('/getCatStatics', (req, res) => {
    const { currentSelectedCatId, range } = req.query;

    // 'week' 범위 처리
    if (range === 'week') {
        const { startDate, endDate } = req.query;
        const query = `SELECT DATE_FORMAT(date, '%Y-%m-%d') AS formatted_date, hydration_guage FROM cat_hydration_statistics_${currentSelectedCatId} WHERE date BETWEEN ? AND ?`;
        db.query(query, [startDate, endDate], (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            console.log(results);

            const newHydrationGuageArr = results.map(record => {
                if (typeof record.formatted_date === 'string') {
                    return { day: record.formatted_date.slice(-2), hydration_guage: record.hydration_guage };
                } else {
                    return { day: 'Unknown', hydration_guage: record.hydration_guage };
                }
            });

            res.send({ newHydrationGuageArr });
        });
    } 
    // 'month' 범위 처리
    else if (range === 'month') {
        const { month } = req.query;
        const query = `SELECT DATE_FORMAT(date, '%Y-%m') AS month, AVG(hydration_guage) AS avg_hydration FROM cat_hydration_statistics_${currentSelectedCatId} WHERE DATE_FORMAT(date, '%Y-%m') = ? GROUP BY month`;
        db.query(query, [month], (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            const newHydrationGuageArr = results.map(record => {
                return { month: record.month, avg_hydration: record.avg_hydration };
            });

            res.send({ newHydrationGuageArr });
        });
    } 
    // 'year' 범위 처리
    else if (range === 'year') {
        const { year } = req.query;
        const query = `SELECT DATE_FORMAT(date, '%Y-%m') AS month, AVG(hydration_guage) AS avg_hydration FROM cat_hydration_statistics_${currentSelectedCatId} WHERE YEAR(date) = ? GROUP BY month`;
        db.query(query, [year], (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            const newHydrationGuageArr = results.map(record => {
                return { month: record.month, avg_hydration: record.avg_hydration };
            });

            res.send({ newHydrationGuageArr });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
