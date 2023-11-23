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

// 특정 월의 주별 날짜 배열을 반환하는 함수
function getWeeksOfMonth(year, month) {
    let weeksOfMonth = [];
    let date;
    let day;
    let week = [];
    const lastDay = new Date(year, month, 0).getDate();

    for (let i = 1; i <= lastDay; i++) {
        date = new Date(year, month - 1, i);
        day = date.getDay();

        week.push(i);

        if (day === 0 || i === lastDay) {
            weeksOfMonth.push(week);
            week = [];
        }
    }

    return weeksOfMonth;
}

// 주어진 날짜가 몇 번째 주에 속하는지 찾는 함수
function getIndexOfWeekInArr(weeksOfMonth, targetDay) {
    for (let i = 0; i < weeksOfMonth.length; i++) {
        if (weeksOfMonth[i].includes(targetDay)) {
            return i;
        }
    }
    return -1; // 주어진 날짜가 어떤 주에도 속하지 않는 경우
}

// 주차별 평균 hydration_guage 값을 계산하는 함수
function calculateWeeklyHydrationData(data, weeksOfMonth) {
    let weeklyHydrationData = [];

    const firstDataDay = data.length > 0 ? new Date(data[0].formatted_date).getDate() : null;
    const startIndex = firstDataDay ? getIndexOfWeekInArr(weeksOfMonth, firstDataDay) : -1;

    weeksOfMonth.forEach((week, index) => {
        let sum = 0;
        let count = 0;

        data.forEach(record => {
            let recordDay = new Date(record.formatted_date).getDate();
            if (week.includes(recordDay)) {
                sum += record.hydration_guage;
                count++;
            }
        });

        if (count > 0 && index >= startIndex) {
            const average = Math.round(sum / count);
            weeklyHydrationData.push({ week: '0' + (index + 1), hydration_guage: average });
        }
    });

    return weeklyHydrationData;
}

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
        const year = parseInt(month.split('-')[0]);
        const monthValue = parseInt(month.split('-')[1]);

        const weeksOfMonth = getWeeksOfMonth(year, monthValue);

        const query = `
            SELECT DATE_FORMAT(date, '%Y-%m-%d') AS formatted_date, DAY(date) AS day, hydration_guage 
            FROM cat_hydration_statistics_${currentSelectedCatId} 
            WHERE DATE_FORMAT(date, '%Y-%m') = ?`;
        db.query(query, [month], (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }

            const weeklyHydrationData = calculateWeeklyHydrationData(results, weeksOfMonth);

            res.send({ newHydrationGuageArr: weeklyHydrationData });
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

            // 월별 데이터 정렬
            results.sort((a, b) => {
                const monthA = parseInt(a.month.slice(-2));
                const monthB = parseInt(b.month.slice(-2));
                return monthA - monthB;
            });

            const formattedResults = results.map(record => {
                return { month: record.month.slice(-2), hydration_guage: record.avg_hydration };
            });

            res.send({ newHydrationGuageArr: formattedResults });
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
