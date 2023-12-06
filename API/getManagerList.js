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
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Database connection established');
});
// GetManagerList API 구현
app.get('/getManagerList', (req, res) => {
    const spaceId = req.query.managementSpaceId;

    const query = `SELECT main_manager_user_email, co_managers_user_email FROM management_space WHERE management_space_id = ?`;
    connection.query(query, [spaceId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(204).json({ message: 'Management space not found' });
        }

        const { main_manager_user_email, co_managers_user_email } = results[0];

        // 공동 관리자 목록에서 주요 관리자 이메일 제거
        let coManagers = JSON.parse(co_managers_user_email);
        coManagers = coManagers.filter(email => email !== main_manager_user_email);

        res.json({ mainManagerUserEmail: main_manager_user_email, coManagersUserEmail: coManagers });
    });
});


module.exports = {
    getManagerList: serverless(app)
};
