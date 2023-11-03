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
  } catch (error) {
    throw error;
  }
};
