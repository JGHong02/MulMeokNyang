import axios from "axios";

export const sendPw = async (email: string) => {
  console.log("-----sendPw API 호출 중-----\n이메일 :", email);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/sendPw",
      {
        params: {
          userEmail: email,
        },
      }
    );
    const sendPwSuccess = res.data.sendPwSuccess;
    console.log("sendPwSuccess :", sendPwSuccess);

    return sendPwSuccess;
  } catch (error: any) {
    console.log("sendPw API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
