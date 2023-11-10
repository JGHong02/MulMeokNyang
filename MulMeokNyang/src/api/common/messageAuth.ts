import axios from "axios";

export const messageAuth = async (phoneNum: string) => {
  try {
    const res = await axios.post("/messageAuth", { userPhoneNum: phoneNum });
    const sendSuccess = res.data.sendSuccess;
    if (sendSuccess) return true;
  } catch (error: any) {
    console.log("messageAuth API 호출 함수에서 error 발생 :", error.message);
    throw error;
  }
};
