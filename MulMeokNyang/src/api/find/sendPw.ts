import axios from "axios";

export const sendPw = async (email: string) => {
  try {
    const res = await axios.get("/sendPw", {
      params: {
        userEmail: email,
      },
    });
    const sendPwSuccess = res.data.sendPwSuccess;
    return sendPwSuccess;
  } catch (error: any) {
    console.log("sendPw API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
