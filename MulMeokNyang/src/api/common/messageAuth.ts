import axios from "axios";

export const messageAuth = async (phoneNum: string) => {
  try {
    const res = await axios.post("/messageAuth", { userPhoneNum: phoneNum });
    const sendSuccess = res.data.sendSuccess;
    if (sendSuccess) return true;
  } catch (error) {
    throw error;
  }
};
