import axios from "axios";

export const checkMessageAuthCode = async (phoneNum: string, code: string) => {
  console.log("-----checkMessageAuthCode API 호출 중-----");
  console.log("phoneNum :", phoneNum);
  console.log("code :", code);

  try {
    const res = await axios.get(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/checkMessageAuthCode",
      {
        params: {
          userPhoneNum: phoneNum,
          authCode: code,
        },
      }
    );
    const authSuccess = res.data.authSuccess;
    console.log("authSuccess :", authSuccess);

    return authSuccess;
  } catch (error: any) {
    console.log(
      "checkMessageAuthCode API 호출 함수에서 error 발생 :",
      error.message
    );
    throw error;
  }
};
