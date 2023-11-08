import axios from "axios";

export const checkMessageAuthCode = async (phoneNum: string, code: string) => {
  try {
    const res = await axios.get("/checkMessageAuthCode", {
      params: {
        userPhoneNum: phoneNum,
        authCode: code,
      },
    });
    const authSuccess = res.data.authSuccess;
    return authSuccess;
  } catch (error: any) {
    console.log(
      "checkMessageAuthCode API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
