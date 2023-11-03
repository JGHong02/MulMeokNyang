import axios from "axios";

export const sendPw = async (email: string) => {
  try {
    const res = await axios.get("/sendPw", {
      params: {
        userEmail: email,
      },
    });
    const sendMail = res.data.sendMail;
    if (sendMail) return true;
  } catch (error) {
    throw error;
  }
};
