const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
const serverless = require('serverless-http');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
const dotenv = require('dotenv');

app.use(cors());

dotenv.config();


const rdsConfig = {
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    database: process.env.RDS_DATABASE,
    password: process.env.RDS_PASSWORD,
  };

  const s3 = new AWS.S3();

  // Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/registUserProfile', upload.single('userProfilePhoto'), async (req, res) => {
    const { userNickname, userEmail, userIntroduction } = req.body;

    try {
        const nicknameExists = await checkNicknameExists(userNickname);

        if (nicknameExists) {
            res.status(200).json({ nicknameExists: true });
        } else {
            const imageMetadata = await saveImageToS3(req.file);

            const connection = mysql.createConnection(rdsConfig);

            const sql = 'INSERT INTO user (user_email, user_profile_photo, user_nickname, user_Introduction) VALUES (?, ?, ?, ?)';
            const values = [userEmail, imageMetadata.filePath, userNickname, userIntroduction];
            const sanitizedValues = values.map(value => (value !== undefined ? value : null));
            await connection.execute(sql, sanitizedValues);

            connection.end();

            res.status(200).json({ registDone: true });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function saveImageToS3(file) {
    const fileExtension = file.mimetype.split('/')[1]; 

    const filePath = `images/${uuidv4()}.${fileExtension}`;
    
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: filePath,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read', 
    };

    await s3.upload(params).promise();

    return { filePath };
};

async function checkNicknameExists(userNickname) {
    const connection = await mysql.createConnection(rdsConfig);
    const rows = await connection.execute('SELECT * FROM user WHERE user_nickname = ?', [userNickname || null]);
    connection.end();
    return rows.length > 0;
};

module.exports = {
    registUserProfile: serverless(app),
};