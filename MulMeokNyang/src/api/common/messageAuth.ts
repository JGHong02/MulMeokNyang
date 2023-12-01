import axios from "axios";

export const messageAuth = async (phoneNum: string) => {
  console.log("-----messageAuth API 호출 중-----\n전화번호 :", phoneNum);

  try {
    const res = await axios.post(
      "https://grhu55elr7.execute-api.ap-northeast-2.amazonaws.com/prod/messageAuth",
      { userPhoneNum: phoneNum }
    );
    const sendSuccess = res.data.sendSuccess;
    console.log("sendSuccess :", sendSuccess);

    if (sendSuccess) return true;
  } catch (error: any) {
    console.log("messageAuth API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
