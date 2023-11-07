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
  } catch (error) {
    throw error;
  }
};
