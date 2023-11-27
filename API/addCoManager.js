const express = require("express");
const mysql = require("mysql2");
const app = express();
const serverless = require("serverless-http");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const dotenv = require("dotenv");
dotenv.config();

const rdsConfig = {
  host: process.env.RDS_HOST,
  user: process.env.RDS_USER,
  database: process.env.RDS_DATABASE,
  password: process.env.RDS_PASSWORD,
};

const connection = mysql.createConnection(rdsConfig);

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Database connection established");
});

// AddCoManager API 구현
app.post("/addCoManager", (req, res) => {
  const { managementSpaceId, userNickname } = req.body;
  const selectUserEmailQuery =
    "SELECT user_email FROM user WHERE user_nickname = ?";

  // userNickname을 사용하여 user_email 찾기
  connection.query(selectUserEmailQuery, [userNickname], (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (user.length === 0) {
      return res.status(204).json({ message: "User not found" });
    }

    const userEmail = user[0].user_email;

    // 로그 추가
    console.log("user_email:", user[0].user_email);

    // coManagersUserEmail 업데이트
    const selectCoManagersQuery =
      "SELECT co_managers_user_email FROM management_space WHERE management_space_id = ?";
    connection.query(
      selectCoManagersQuery,
      [managementSpaceId],
      (err, spaces) => {
        if (err) {
          return res.status(500).json({ error: "Internal Server Error" });
        }
        if (spaces.length === 0) {
          return res
            .status(204)
            .json({ message: "Management space not found" });
        }

        // 로그 추가
        console.log(
          "co_managers_user_email:",
          spaces[0].co_managers_user_email
        );

        let coManagersUserEmail = JSON.parse(spaces[0].co_managers_user_email);

        // co_managers_user_email 값이 존재하고 유효한 JSON 문자열이면 파싱
        if (coManagersUserEmail && typeof coManagersUserEmail === "string") {
          coManagersUserEmail = JSON.parse(coManagersUserEmail);
        } else {
          coManagersUserEmail = [];
        }

        // 로그 추가
        console.log("emails:", coManagersUserEmail);

        coManagersUserEmail.push(userEmail);

        // 로그 추가
        console.log("addemails:", coManagersUserEmail);

        // coManagersUserEmail을 JSON 문자열로 변환
        const updatedCoManagersUserEmail = JSON.stringify(coManagersUserEmail);

        // coManagersUserEmail 업데이트
        connection.query(
          "UPDATE management_space SET co_managers_user_email = ? WHERE management_space_id = ?",
          [updatedCoManagersUserEmail, managementSpaceId],
          (err) => {
            if (err) {
              return res.status(500).json({ error: "Internal Server Error" });
            }

            res.json({ addSuccess: true });
          }
        );
      }
    );
  });
});

module.exports = {
  addCoManager: serverless(app),
};

app.listen(3000, () => {
  console.log(`Server running on http://localhost:3000`);
});
